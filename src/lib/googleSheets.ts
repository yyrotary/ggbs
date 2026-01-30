import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

async function getSheetsInstance() {
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}"),
        scopes: SCOPES,
    });

    const authClient = await auth.getClient();
    return google.sheets({ version: "v4", auth: authClient as any });
}

export async function appendToSheet(values: any[]) {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = "Sheet1!A:M"; // Adjusted for 13 fields (incl. transactionType)

    const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [values],
        },
    });

    return response.data;
}

export async function lookupFromSheet(name: string, phone: string) {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = "Sheet1!A:M";

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    // Assuming columns: 0: Date, 1: Name, 2: No, 3: Phone, 4: Address, 5: Product, 
    // 6: Unit Price, 7: Qty, 8: Supply, 9: VAT, 10: Total, 11: Remarks
    const data = rows.slice(1);

    return data.map((row, index) => ({ row, originalIndex: index + 2 }))
        .filter(({ row }) => {
            const matchName = name ? row[1]?.toString().includes(name) : true;
            const matchPhone = phone ? row[3]?.toString().endsWith(phone) : true;
            return matchName && matchPhone;
        }).map(({ row, originalIndex }) => {
            return {
                rowId: originalIndex,
                saleDate: row[0],
                customerName: row[1],
                customerNo: row[2],
                phone: row[3],
                address: row[4],
                productName: row[5],
                unitPrice: row[6],
                quantity: row[7],
                supplyAmount: row[8],
                vat: row[9],
                totalAmount: row[10],
                remarks: row[11],
                transactionType: row[12] || "판매", // Default to Sales if missing
            };
        });
}

export async function getAllSales() {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = "Sheet1!A:M";

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    const data = rows.slice(1);

    return data.map((row, index) => ({
        rowId: index + 2,
        saleDate: row[0],
        customerName: row[1],
        customerNo: row[2],
        phone: row[3],
        address: row[4],
        productName: row[5],
        unitPrice: parseFloat(row[6]?.toString().replace(/[^0-9.-]+/g, "") || "0"),
        quantity: parseFloat(row[7]?.toString().replace(/[^0-9.-]+/g, "") || "0"),
        supplyAmount: parseFloat(row[8]?.toString().replace(/[^0-9.-]+/g, "") || "0"),
        vat: parseFloat(row[9]?.toString().replace(/[^0-9.-]+/g, "") || "0"),
        totalAmount: parseFloat(row[10]?.toString().replace(/[^0-9.-]+/g, "") || "0"),
        remarks: row[11],
        transactionType: row[12] || "판매",
    }));
}

export async function getNextCustomerNo() {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = "Sheet1!C:C"; // Only need the Customer No column

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return "C-1001";

    // Skip header and filter for valid formats like C-1001
    const customerNos = rows.slice(1)
        .map(row => row[0]?.toString() || "")
        .filter(no => no.startsWith("C-"));

    if (customerNos.length === 0) return "C-1001";

    const maxNo = customerNos.reduce((max, current) => {
        const currentNum = parseInt(current.replace("C-", ""), 10);
        return isNaN(currentNum) ? max : Math.max(max, currentNum);
    }, 1000);

    return `C-${maxNo + 1}`;
}

export async function deleteRow(rowId: number) {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Get sheetId for "Sheet1"
    const metadata = await sheets.spreadsheets.get({
        spreadsheetId,
    });
    const sheet = metadata.data.sheets?.find(s => s.properties?.title === "Sheet1");
    const sheetId = sheet?.properties?.sheetId || 0;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            sheetId,
                            dimension: "ROWS",
                            startIndex: rowId - 1,
                            endIndex: rowId,
                        },
                    },
                },
            ],
        },
    });
}

/**
 * Ensures that the "Settings" sheet exists.
 * If not, creates it and initializes with default simple_password = 123456.
 */
export async function ensureSettingsSheet() {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 1. Check if "Settings" sheet exists, create if missing
    const metadata = await sheets.spreadsheets.get({ spreadsheetId });
    const settingsSheet = metadata.data.sheets?.find(s => s.properties?.title === "Settings");

    if (!settingsSheet) {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: "Settings",
                            },
                        },
                    },
                ],
            },
        });
    }

    // 2. Read current settings to check what's missing
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Settings!A:B",
    });

    const rows = response.data.values || [];
    const existingKeys = new Set(rows.map(row => row[0]));

    const REQUIRED_DEFAULTS: Record<string, string> = {
        "simple_password": "123456",
        "supplier_name": "금가보석",
        "supplier_ceo": "홍길동",
        "supplier_reg_no": "123-45-67890",
        "supplier_address": "서울시 종로구 돈화문로 123",
        "supplier_phone": "010-0000-0000",
    };

    const valuesToAppend: string[][] = [];

    // Add Header if sheet is completely empty
    if (rows.length === 0) {
        valuesToAppend.push(["Key", "Value"]);
    }

    // Check for missing keys
    for (const [key, defaultValue] of Object.entries(REQUIRED_DEFAULTS)) {
        if (!existingKeys.has(key)) {
            valuesToAppend.push([key, defaultValue]);
        }
    }

    // 3. Append missing values
    if (valuesToAppend.length > 0) {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Settings!A:B",
            valueInputOption: "RAW",
            requestBody: {
                values: valuesToAppend,
            },
        });
    }
}

export async function getSettings() {
    await ensureSettingsSheet();
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Settings!A:B",
    });

    const rows = response.data.values || [];
    // Convert to object
    const settings: any = {};
    rows.forEach(row => {
        if (row[0] && row[0] !== "Key") {
            settings[row[0]] = row[1] || "";
        }
    });

    return settings;
}

export async function updateSettings(updates: { key: string; value: string }[]) {
    await ensureSettingsSheet();
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Read current settings to find rows
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Settings!A:B",
    });

    const rows = response.data.values || [];
    const requests: any[] = [];

    for (const { key, value } of updates) {
        let rowIndex = rows.findIndex(row => row[0] === key);

        if (rowIndex === -1) {
            // Append new key
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: "Settings!A:B",
                valueInputOption: "RAW",
                requestBody: {
                    values: [[key, value]],
                },
            });
            // Update local rows cache if we were to continue (but append is simple)
        } else {
            // Update existing
            const sheetRow = rowIndex + 1;
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `Settings!B${sheetRow}`,
                valueInputOption: "RAW",
                requestBody: {
                    values: [[value]],
                },
            });
        }
    }
}

export async function verifyPassword(inputPassword: string): Promise<boolean> {
    const settings = await getSettings();
    const storedPassword = settings["simple_password"] || "123456";
    return storedPassword === inputPassword;
}

export async function updatePassword(newPassword: string) {
    await updateSettings([{ key: "simple_password", value: newPassword }]);
}
