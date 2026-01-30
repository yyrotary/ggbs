import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/googleSheets';

export async function GET() {
    try {
        const settings = await getSettings();
        return NextResponse.json({ success: true, settings });
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
    }
}
