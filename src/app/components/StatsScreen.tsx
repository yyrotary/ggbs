"use client";

import { useState, useEffect } from "react";
import {
    BarChart3, TrendingUp, Users, DollarSign,
    Printer, ArrowLeft, Loader2, Package,
    Calendar, ChevronRight, Download, Diamond, FileText
} from "lucide-react";

export default function StatsScreen({ onBack }: { onBack: () => void }) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [period, setPeriod] = useState<"all" | "today" | "month" | "custom">("month");
    const [dateRange, setDateRange] = useState({
        start: new Date().toISOString().split("T")[0],
        end: new Date().toISOString().split("T")[0]
    });

    useEffect(() => {
        fetchStats();
    }, [period, dateRange]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            let url = "/api/stats";
            const params = new URLSearchParams();

            if (period === "today") {
                const today = new Date().toISOString().split("T")[0];
                params.append("startDate", today);
                params.append("endDate", today);
            } else if (period === "month") {
                const now = new Date();
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
                const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
                params.append("startDate", firstDay);
                params.append("endDate", lastDay);
            } else if (period === "custom") {
                params.append("startDate", dateRange.start);
                params.append("endDate", dateRange.end);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const periodLabels = {
        all: "전체 기간",
        today: "오늘",
        month: "이번 달",
        custom: "기간 지정"
    };

    return (
        <div className="min-h-screen bg-[#0D0B14] text-white animate-in fade-in duration-500 pb-20">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-[#0D0B14]/90 backdrop-blur-xl border-b border-[#D4AF37]/20 no-print">
                <div className="flex items-center p-6 justify-between max-w-lg mx-auto">
                    <button
                        onClick={onBack}
                        className="text-[#D4AF37] flex size-12 shrink-0 items-center justify-center bg-[#D4AF37]/10 rounded-2xl hover:bg-[#D4AF37]/20 transition-all font-bold gold-glow"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <div className="flex items-center gap-3">
                        <Diamond size={24} className="text-[#D4AF37] fill-[#D4AF37]" />
                        <h2 className="text-white text-2xl font-black leading-tight tracking-tight text-center font-display">
                            통계·출력
                        </h2>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="text-[#D4AF37] flex size-12 shrink-0 items-center justify-center bg-[#D4AF37]/10 rounded-2xl hover:bg-[#D4AF37]/20 transition-all font-bold gold-glow"
                    >
                        <Printer size={28} />
                    </button>
                </div>
            </div>

            <main className="max-w-lg mx-auto p-6 space-y-8">
                {/* Period Selector */}
                <section className="space-y-4 no-print">
                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-[#D4AF37]/20">
                        {(["all", "today", "month", "custom"] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all ${period === p
                                    ? "bg-[#D4AF37] text-[#0D0B14] shadow-lg shadow-[#D4AF37]/20"
                                    : "text-gray-400 hover:bg-white/5"
                                    }`}
                            >
                                {periodLabels[p]}
                            </button>
                        ))}
                    </div>

                    {period === "custom" && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#D4AF37] uppercase tracking-widest px-1">시작일</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                    className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl h-14 px-4 text-lg font-bold focus:ring-1 focus:ring-[#D4AF37] outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#D4AF37] uppercase tracking-widest px-1">종료일</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                    className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl h-14 px-4 text-lg font-bold focus:ring-1 focus:ring-[#D4AF37] outline-none"
                                />
                            </div>
                        </div>
                    )}
                </section>

                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-[#D4AF37]">
                        <Loader2 className="w-12 h-12 animate-spin" />
                        <p className="text-lg font-bold animate-pulse">데이터 분석 중...</p>
                    </div>
                ) : stats ? (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-[#2D2616] to-[#0D0B14] border border-[#D4AF37]/30 rounded-3xl p-6 space-y-3 shadow-lg gold-glow">
                                <div className="p-3 bg-[#D4AF37]/20 w-fit rounded-xl text-[#D4AF37]">
                                    <DollarSign size={28} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">매출 총합</p>
                                    <p className="text-2xl font-black tracking-tighter tabular-nums text-white truncate">₩ {stats.totalRevenue.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-[#D4AF37]/20 rounded-3xl p-6 space-y-3 shadow-lg">
                                <div className="p-3 bg-white/10 w-fit rounded-xl text-white">
                                    <FileText size={28} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">판매 건수</p>
                                    <p className="text-2xl font-black tracking-tighter tabular-nums text-white">{stats.salesCount}건</p>
                                </div>
                            </div>
                        </div>

                        {/* Popular Products */}
                        <section className="space-y-5">
                            <div className="flex items-center gap-3 px-2">
                                <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                                    <Package size={24} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-white">인기 품목 TOP 5</h3>
                            </div>
                            {stats.topProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.topProducts.map((product: any, idx: number) => (
                                        <div key={idx} className="bg-white/5 border border-[#D4AF37]/10 rounded-2xl p-5 flex items-center justify-between hover:border-[#D4AF37]/40 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl font-black text-[#D4AF37]/40 italic group-hover:text-[#D4AF37] transition-colors">0{idx + 1}</span>
                                                <div>
                                                    <p className="font-bold text-lg leading-tight text-white">{product.name}</p>
                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">{product.count}회 판매</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black tabular-nums text-[#D4AF37]">₩ {product.revenue.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white/5 border border-dashed border-[#D4AF37]/20 rounded-3xl p-10 text-center">
                                    <p className="text-lg text-gray-500 font-bold">지정된 기간에 판매 데이터가 없습니다.</p>
                                </div>
                            )}
                        </section>

                        {/* Recent Transactions List (Screen View) */}
                        {stats.recentSales.length > 0 && (
                            <section className="space-y-5 no-print">
                                <div className="flex items-center gap-3 px-2">
                                    <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                                        <Calendar size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-white">최근 거래 기록</h3>
                                </div>
                                <div className="space-y-3">
                                    {stats.recentSales.map((sale: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-[#D4AF37]/10 hover:bg-[#D4AF37]/5 transition-colors">
                                            <div className="space-y-1">
                                                <p className="font-bold text-lg text-white">{sale.customerName}</p>
                                                <p className="text-sm text-gray-400">{sale.productName}</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="font-black text-lg text-[#D4AF37]">₩ {(sale.totalAmount || 0).toLocaleString()}</p>
                                                <p className="text-xs text-gray-500 uppercase font-black tracking-widest">{sale.saleDate}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Professional Print Layout (White Background) */}
                        <div className="hidden print:block text-black bg-white h-full relative">
                            {/* Document Header */}
                            <header className="border-b-[3px] border-black pb-6 mb-8 flex justify-between items-end">
                                <div>
                                    <h1 className="text-4xl font-serif font-black tracking-widest mb-2">매 출 분 석 보 고 서</h1>
                                    <p className="text-sm font-medium text-gray-500">Sales Analysis Report</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 justify-end mb-1">
                                        <Diamond className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                                        <span className="text-xl font-bold tracking-tight">{stats.supplierInfo?.supplier_name || "금가보석"}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Tel: {stats.supplierInfo?.supplier_phone || "010-0000-0000"}</p>
                                    <p className="text-xs text-gray-500">{stats.supplierInfo?.supplier_address || "서울시 종로구 돈화문로"}</p>
                                </div>
                            </header>

                            {/* Info Section */}
                            <div className="grid grid-cols-2 gap-8 mb-10 text-sm break-inside-avoid">
                                {/* Analysis Info */}
                                <div className="border border-gray-300 p-4 rounded-sm">
                                    <h3 className="font-bold border-b border-gray-300 pb-2 mb-3 text-lg flex justify-between">
                                        분석 기간 <span className="font-normal text-xs mt-1">(Period)</span>
                                    </h3>
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="py-1 text-gray-500 w-24">기 간 구 분</td>
                                                <td className="font-bold text-lg">
                                                    {periodLabels[period]}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-500">시 작 일</td>
                                                <td>
                                                    {period === 'custom' ? dateRange.start :
                                                        period === 'today' ? new Date().toISOString().split("T")[0] :
                                                            period === 'month' ? new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0] : '-'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-500">종 료 일</td>
                                                <td>
                                                    {period === 'custom' ? dateRange.end :
                                                        period === 'today' ? new Date().toISOString().split("T")[0] :
                                                            period === 'month' ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0] : '-'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Supplier Info */}
                                <div className="border border-gray-300 p-4 rounded-sm bg-gray-50 print:bg-transparent">
                                    <h3 className="font-bold border-b border-gray-300 pb-2 mb-3 text-lg flex justify-between">
                                        발행자 <span className="font-normal text-xs mt-1">(Issuer)</span>
                                    </h3>
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="py-1 text-gray-500 w-20">상 호</td>
                                                <td className="font-bold">{stats.supplierInfo?.supplier_name || "금가보석"}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-500">대 표 자</td>
                                                <td>{stats.supplierInfo?.supplier_ceo || "홍 길 동"}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-500">사업자번호</td>
                                                <td>{stats.supplierInfo?.supplier_reg_no || "123-45-67890"}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-500 align-top">주 소</td>
                                                <td>{stats.supplierInfo?.supplier_address || "서울시 종로구 돈화문로 123"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Metrics Summary Table */}
                            <div className="mb-10 break-inside-avoid">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                    <div className="w-1 h-5 bg-black"></div>
                                    요약 (Summary)
                                </h3>
                                <table className="w-full text-sm border-collapse border border-black">
                                    <thead>
                                        <tr className="bg-gray-100 print:bg-gray-100/50">
                                            <th className="border border-black py-2 px-4 text-left">항목</th>
                                            <th className="border border-black py-2 px-4 text-right">내용</th>
                                            <th className="border border-black py-2 px-4 text-left">비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-black py-3 px-4 font-bold">총 매출액</td>
                                            <td className="border border-black py-3 px-4 text-right font-black text-xl">
                                                ₩ {stats.totalRevenue.toLocaleString()}
                                            </td>
                                            <td className="border border-black py-3 px-4 text-gray-500 text-xs">VAT 포함</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black py-3 px-4 font-bold">총 판매 건수</td>
                                            <td className="border border-black py-3 px-4 text-right font-bold">
                                                {stats.salesCount} 건
                                            </td>
                                            <td className="border border-black py-3 px-4 text-gray-500 text-xs"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Top Products Table */}
                            {stats.topProducts.length > 0 && (
                                <div className="mb-10 break-inside-avoid">
                                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-black"></div>
                                        주요 품목 실적 (Top 5 Products)
                                    </h3>
                                    <table className="w-full text-sm border-collapse border border-black">
                                        <thead>
                                            <tr className="bg-gray-100 print:bg-gray-100/50">
                                                <th className="border border-black py-2 px-2 w-[10%] text-center">순위</th>
                                                <th className="border border-black py-2 px-2 text-left">품목명</th>
                                                <th className="border border-black py-2 px-2 w-[15%] text-center">판매수</th>
                                                <th className="border border-black py-2 px-2 w-[25%] text-right">매출액</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.topProducts.map((p: any, i: number) => (
                                                <tr key={i}>
                                                    <td className="border border-black py-2 px-2 text-center text-xs">{i + 1}</td>
                                                    <td className="border border-black py-2 px-2 font-medium">{p.name}</td>
                                                    <td className="border border-black py-2 px-2 text-center">{p.count}</td>
                                                    <td className="border border-black py-2 px-2 text-right font-bold">₩ {p.revenue.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Full Transaction List */}
                            <div className="mb-12">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                    <div className="w-1 h-5 bg-black"></div>
                                    상세 거래 내역 (Details)
                                </h3>
                                <table className="w-full text-sm border-collapse border border-black">
                                    <thead>
                                        <tr className="bg-gray-100 print:bg-gray-100/50 text-xs">
                                            <th className="border border-black py-2 px-2 w-[12%]">날짜</th>
                                            <th className="border border-black py-2 px-2 w-[15%]">고객명</th>
                                            <th className="border border-black py-2 px-2">품목</th>
                                            <th className="border border-black py-2 px-2 w-[10%] text-right">단가</th>
                                            <th className="border border-black py-2 px-2 w-[8%] text-center">수량</th>
                                            <th className="border border-black py-2 px-2 w-[15%] text-right">합계</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(stats.filteredSales || []).map((sale: any, i: number) => (
                                            <tr key={i} className="break-inside-avoid">
                                                <td className="border border-black py-2 px-2 text-center text-xs">{sale.saleDate}</td>
                                                <td className="border border-black py-2 px-2 text-xs font-bold">{sale.customerName}</td>
                                                <td className="border border-black py-2 px-2 text-xs">{sale.productName}</td>
                                                <td className="border border-black py-2 px-2 text-right text-xs">{sale.unitPrice?.toLocaleString()}</td>
                                                <td className="border border-black py-2 px-2 text-center text-xs">{sale.quantity}</td>
                                                <td className="border border-black py-2 px-2 text-right text-xs font-bold">₩ {(sale.totalAmount || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                            <div className="text-center pt-8 border-t border-gray-300 mt-10 break-inside-avoid">
                                <p className="text-lg font-serif font-bold mb-8">위와 같이 매출 내역을 보고합니다.</p>
                                <div className="flex justify-end gap-16 px-10">
                                    <div className="text-center">
                                        <p className="mb-4 text-sm text-gray-500">작성자 (서명/인)</p>
                                        <p className="font-serif font-black text-xl">{stats.supplierInfo?.supplier_ceo || "홍 길 동"}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="mb-4 text-sm text-gray-500">승인자 (서명/인)</p>
                                        <p className="font-serif font-black text-xl text-gray-300">Signature</p>
                                    </div>
                                </div>
                                <div className="mt-8 text-[10px] text-gray-400 uppercase">
                                    Generated by {stats.supplierInfo?.supplier_name ? `${stats.supplierInfo.supplier_name} ` : 'GEUM-GA '} Premium Management System at {new Date().toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="inline-flex p-4 bg-white/5 rounded-full">
                            <BarChart3 className="text-gray-500" size={32} />
                        </div>
                        <p className="text-gray-500 font-medium">데이터를 불러올 수 없습니다.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
