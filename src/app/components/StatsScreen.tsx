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
                        <div className="hidden print:block space-y-12 pt-12 text-black bg-white">
                            {/* Header Section */}
                            <div className="text-center space-y-4 border-b-4 border-black pb-8">
                                <h1 className="text-5xl font-black tracking-tighter">판매 분석 보고서</h1>
                                <div className="flex justify-between items-end px-2">
                                    <div className="text-left space-y-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Client</p>
                                        <p className="text-lg font-black italic">금가보석 (GEUM-GA)</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Analysis Period</p>
                                        <p className="text-lg font-black">
                                            {period === "all" ? "전체 기간" : (period === "custom" ? `${dateRange.start} ~ ${dateRange.end}` : periodLabels[period])}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Summary */}
                            <div className="grid grid-cols-2 gap-12 bg-gray-50 p-10 border border-black rounded-3xl">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-6 bg-black"></div>
                                        <p className="text-sm font-black uppercase tracking-widest text-gray-500">매출 총계</p>
                                    </div>
                                    <p className="text-5xl font-black">₩ {stats.totalRevenue.toLocaleString()}</p>
                                </div>
                                <div className="space-y-4 border-l border-black/10 pl-12">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-6 bg-black"></div>
                                        <p className="text-sm font-black uppercase tracking-widest text-gray-500">판매 건수</p>
                                    </div>
                                    <p className="text-5xl font-black">{stats.salesCount}건</p>
                                </div>
                            </div>

                            {/* Popular Products Summary */}
                            <div className="space-y-6 break-inside-avoid">
                                <div className="flex items-center gap-3">
                                    <Package size={24} strokeWidth={3} />
                                    <h3 className="text-2xl font-black tracking-tight">주요 품목별 실적 (TOP 5)</h3>
                                </div>
                                <table className="w-full text-left border-t-2 border-black border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 uppercase text-[10px] font-black tracking-widest text-gray-600 border-b border-black">
                                            <th className="py-4 px-4">품목명</th>
                                            <th className="py-4 px-4 text-center">판매수</th>
                                            <th className="py-4 px-4 text-right">매출합계</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.topProducts.map((p: any, i: number) => (
                                            <tr key={i} className="border-b border-gray-200 font-bold">
                                                <td className="py-4 px-4 text-base italic">{p.name}</td>
                                                <td className="py-4 px-4 text-center tabular-nums">{p.count}</td>
                                                <td className="py-4 px-4 text-right tabular-nums text-lg">₩ {p.revenue.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Full Transaction List - The main table document */}
                            <div className="space-y-6 pt-10">
                                <div className="flex items-center gap-3">
                                    <Calendar size={24} strokeWidth={3} />
                                    <h3 className="text-2xl font-black tracking-tight">상세 거래 명세서 (전체 데이터)</h3>
                                </div>
                                <table className="w-full text-left border-t-2 border-black border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 uppercase text-[10px] font-black tracking-widest text-gray-600 border-b border-black">
                                            <th className="py-4 px-4">판매일자</th>
                                            <th className="py-4 px-4">고객명</th>
                                            <th className="py-4 px-4">품목명</th>
                                            <th className="py-4 px-4 text-right">판매금액</th>
                                            <th className="py-4 px-4">비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(stats.filteredSales || []).map((sale: any, i: number) => (
                                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors break-inside-avoid">
                                                <td className="py-4 px-4 text-xs font-bold tabular-nums text-gray-500">{sale.saleDate}</td>
                                                <td className="py-4 px-4 text-sm font-black">{sale.customerName}</td>
                                                <td className="py-4 px-4 text-sm font-bold text-gray-700">{sale.productName}</td>
                                                <td className="py-4 px-4 text-right text-sm font-black tabular-nums">₩ {(sale.totalAmount || 0).toLocaleString()}</td>
                                                <td className="py-4 px-4 text-xs font-medium text-gray-400 italic max-w-[100px] truncate">{sale.remark || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer & Signature */}
                            <div className="pt-40 text-center flex flex-col items-center gap-12 break-inside-avoid text-black">
                                <div className="space-y-4">
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-[0.4em]">Authorized Signature</p>
                                    <div className="w-64 h-[2px] bg-black"></div>
                                    <p className="text-2xl font-display font-black tracking-[0.2em] italic">GEUM-GA JEWELRY</p>
                                    <div className="flex items-center justify-center gap-4 text-sm font-bold pt-4 text-gray-600">
                                        <span>대표이사 박영수</span>
                                        <div className="size-16 border-4 border-red-600 rounded-full flex items-center justify-center text-red-600 font-black rotate-[-15deg] opacity-80 select-none">
                                            금가보석
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1 text-gray-400">
                                    <p className="text-[10px] italic uppercase">
                                        This document is electronically generated and contains confidential financial data.
                                    </p>
                                    <p className="text-[10px] font-black uppercase">
                                        Printed at {new Date().toLocaleString()} from GEUM-GA Premium Management System
                                    </p>
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
