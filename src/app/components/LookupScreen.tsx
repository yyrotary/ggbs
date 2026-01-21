"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Phone, User, Calendar, Tag, Trash2, ArrowLeft, Loader2, Diamond, Hash, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function LookupScreen({ onBack }: { onBack: () => void }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 5;

    // Separate fetch function to allow manual refresh
    const performSearch = useCallback(async (currentSearchTerm: string, currentPage: number) => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                q: currentSearchTerm,
                page: currentPage.toString(),
                limit: limit.toString()
            }).toString();

            const response = await fetch(`/api/search?${query}`);
            const data = await response.json();

            if (data.success) {
                setTransactions(data.results);
                setTotalCount(data.total);
            } else {
                setTransactions([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("Search failed:", error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    // Initial load & Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchTerm, page);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, page, performSearch]);

    const handleDelete = async (rowId: number) => {
        if (!confirm("정말 이 거래 내역을 삭제하시겠습니까? (복구 불가)")) return;

        try {
            const response = await fetch(`/api/delete?rowId=${rowId}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (result.success) {
                alert("삭제되었습니다.");
                // Refresh current page
                performSearch(searchTerm, page);
            } else {
                alert("삭제 실패: " + result.error);
            }

        } catch (error) {
            console.error("Delete failed:", error);
            alert("서버 오류로 삭제하지 못했습니다.");
        }
    };

    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="min-h-screen bg-[#0D0B14] text-white animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-[#0D0B14]/90 backdrop-blur-xl border-b border-[#D4AF37]/20">
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
                            고객 조회
                        </h2>
                    </div>
                    <div className="size-12"></div>
                </div>
            </div>

            <main className="max-w-lg mx-auto p-6 space-y-6">
                {/* Search Box */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="text-[#D4AF37]" size={28} />
                    </div>
                    <input
                        type="text"
                        placeholder="이름 또는 전화번호 검색"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // Reset to page 1 on search
                        }}
                        className="w-full h-20 pl-14 pr-12 bg-white/5 border border-[#D4AF37]/30 rounded-[2rem] text-xl font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => { setSearchTerm(""); setPage(1); }}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Results List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4 text-[#D4AF37]">
                            <Loader2 className="w-12 h-12 animate-spin" />
                            <p className="text-lg font-bold animate-pulse">데이터 조회 중...</p>
                        </div>
                    ) : transactions.length > 0 ? (
                        <>
                            <div className="flex justify-between items-end px-2">
                                <p className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase">
                                    검색 결과 <span className="text-white">{totalCount}</span>건
                                </p>
                            </div>

                            {transactions.map((tx, idx) => (
                                <div
                                    key={idx}
                                    className="relative overflow-hidden bg-white/5 border border-[#D4AF37]/20 rounded-3xl p-6 space-y-5 hover:border-[#D4AF37]/50 transition-all gold-glow group"
                                >
                                    {/* Header: Date & Customer */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#D4AF37]/10 p-3 rounded-2xl text-[#D4AF37]">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white leading-none mb-1">{tx.customerName}</h3>
                                                <p className="text-[#D4AF37] text-sm font-bold tracking-widest">{tx.saleDate}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(tx.rowId)}
                                            className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors opacity-60 hover:opacity-100"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-white/10 w-full"></div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                                                <Hash size={12} /> 고객번호
                                            </div>
                                            <p className="text-lg font-bold text-white pl-5">{tx.customerNo || "-"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                                                <Phone size={12} /> 전화번호
                                            </div>
                                            <p className="text-lg font-bold text-white pl-5">{tx.phone}</p>
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                                                <Tag size={12} /> 구매물품
                                            </div>
                                            <div className="text-xl font-black text-[#D4AF37] pl-5 flex items-center justify-between">
                                                <span>{tx.productName}</span>
                                                <span className="text-white">₩{tx.totalAmount?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-6 pt-6">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#D4AF37]/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <span className="text-lg font-black tracking-widest text-[#D4AF37]">
                                        {page} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#D4AF37]/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-20 text-center space-y-4 opacity-50">
                            <div className="inline-flex p-6 bg-white/5 rounded-full mb-2">
                                <Search size={40} className="text-gray-500" />
                            </div>
                            <p className="text-xl font-bold text-gray-400">거래 내역이 없습니다.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
