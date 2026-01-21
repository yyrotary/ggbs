import { NextResponse } from "next/server";
import { deleteRow } from "@/lib/googleSheets";

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const rowId = parseInt(searchParams.get("rowId") || "", 10);

        if (!rowId) {
            return NextResponse.json({ success: false, error: "Row ID required" }, { status: 400 });
        }

        await deleteRow(rowId);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
