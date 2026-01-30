import { NextResponse } from 'next/server';
import { updatePassword } from '@/lib/googleSheets';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        await updatePassword(password);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
    }
}
