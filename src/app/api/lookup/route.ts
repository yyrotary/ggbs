import { NextResponse } from "next/server";
import { lookupFromSheet } from "@/lib/googleSheets";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get("name") || "";
        const phone = searchParams.get("phone") || "";

        const results = await lookupFromSheet(name, phone);

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error("Lookup Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
