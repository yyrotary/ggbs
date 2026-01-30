import { getAllSales, getSettings } from "@/lib/googleSheets";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const [sales, settings] = await Promise.all([
            getAllSales(),
            getSettings()
        ]);

        let filteredSales = sales;

        if (startDate || endDate) {
            filteredSales = sales.filter(s => {
                const saleDate = new Date(s.saleDate);
                if (startDate && saleDate < new Date(startDate)) return false;
                if (endDate && saleDate > new Date(endDate)) return false;
                return true;
            });
        }

        if (!filteredSales || filteredSales.length === 0) {
            return NextResponse.json({
                success: true,
                stats: {
                    totalRevenue: 0,
                    salesCount: 0,
                    avgOrderValue: 0,
                    topProducts: [],
                    recentSales: [],
                    supplierInfo: settings
                }
            });
        }

        const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
        const salesCount = filteredSales.length;
        const avgOrderValue = totalRevenue / salesCount;

        // Group by product
        const productStats = filteredSales.reduce((acc: any, s) => {
            const name = s.productName || "Unknown";
            if (!acc[name]) {
                acc[name] = { name, count: 0, revenue: 0 };
            }
            acc[name].count += 1;
            acc[name].revenue += (s.totalAmount || 0);
            return acc;
        }, {});

        const topProducts = Object.values(productStats)
            .sort((a: any, b: any) => b.revenue - a.revenue)
            .slice(0, 5);

        const recentSales = filteredSales
            .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
            .slice(0, 10);

        return NextResponse.json({
            success: true,
            stats: {
                totalRevenue,
                salesCount,
                avgOrderValue,
                topProducts,
                recentSales,
                filteredSales: filteredSales.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()),
                supplierInfo: settings
            }
        });
    } catch (error: any) {
        console.error("Stats API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
