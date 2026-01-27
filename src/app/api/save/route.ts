import { NextResponse } from "next/server";
import { appendToSheet } from "@/lib/googleSheets";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            saleDate, customerName, customerNo, phone, address,
            productName, unitPrice, quantity, supplyAmount, vat,
            totalAmount, remarks, transactionType
        } = body;

        const row = [
            saleDate, customerName, customerNo, phone, address,
            productName, unitPrice, quantity, supplyAmount, vat,
            totalAmount, remarks, transactionType
        ];

        await appendToSheet(row);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Save Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
