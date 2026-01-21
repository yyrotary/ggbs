import { NextResponse } from "next/server";
import { getAllSales } from "@/lib/googleSheets";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "5", 10);

        let sales = await getAllSales();

        // Sort by date descending (newest first)
        // sales is already an array of objects. We can sort by saleDate.
        // Assuming saleDate is "YYYY-MM-DD".
        sales.sort((a, b) => {
            const dateA = new Date(a.saleDate).getTime();
            const dateB = new Date(b.saleDate).getTime();
            return dateB - dateA; // Descending
        });

        if (query) {
            const searchLower = query.toLowerCase();
            sales = sales.filter(s => {
                const nameMatch = s.customerName?.toLowerCase().includes(searchLower);
                // For phone, remove dashes for flexible search if needed, but let's stick to simple includes
                const phoneMatch = s.phone?.includes(query);
                return nameMatch || phoneMatch;
            });
        }

        const total = sales.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const results = sales.slice(startIndex, endIndex);

        return NextResponse.json({
            success: true,
            results,
            total
        });
    } catch (error: any) {
        console.error("Search API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
