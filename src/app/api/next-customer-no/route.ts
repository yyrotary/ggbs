import { NextResponse } from "next/server";
import { getNextCustomerNo } from "@/lib/googleSheets";

export async function GET() {
    try {
        const nextNo = await getNextCustomerNo();
        return NextResponse.json({ success: true, nextNo });
    } catch (error: any) {
        console.error("Next Customer No Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
