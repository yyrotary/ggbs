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
    const range = "Sheet1!A:L"; // Adjusted for 12 fields + timestamp? No, precisely 12 fields.

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
    const range = "Sheet1!A:L";

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
            };
        });
}

export async function getAllSales() {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = "Sheet1!A:L";

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
