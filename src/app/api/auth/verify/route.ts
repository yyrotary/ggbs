import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/googleSheets';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const isValid = await verifyPassword(password);
        return NextResponse.json({ success: isValid });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to verify' }, { status: 500 });
    }
}
