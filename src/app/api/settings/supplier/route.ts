import { NextResponse } from 'next/server';
import { updateSettings } from '@/lib/googleSheets';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const updates = Object.keys(body).map(key => ({
            key,
            value: body[key]
        }));

        await updateSettings(updates);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update settings:", error);
        return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
    }
}
