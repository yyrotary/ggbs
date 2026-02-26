import { NextResponse } from "next/server";
import { updateRow } from "@/lib/googleSheets";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const {
            rowId, saleDate, customerName, customerNo, phone, address,
            productName, unitPrice, quantity, supplyAmount, vat,
            totalAmount, remarks, transactionType
        } = body;

        if (!rowId) {
            return NextResponse.json({ success: false, error: "Row ID is required" }, { status: 400 });
        }

        const row = [
            saleDate, customerName, customerNo, phone, address,
            productName, unitPrice, quantity, supplyAmount, vat,
            totalAmount, remarks, transactionType
        ];

        await updateRow(rowId, row);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Update Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
