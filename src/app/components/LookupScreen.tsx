"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Phone, User, Calendar, Tag, Trash2, ArrowLeft, Loader2, Diamond, Hash, ChevronLeft, ChevronRight, X, MapPin, ReceiptText, FileText, Printer } from "lucide-react";
import TransactionStatement from "./TransactionStatement";

export default function LookupScreen({ onBack }: { onBack: () => void }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 50; // Fetch more to allow grouping, though API actually handles paging. 
    // For specific customer grouping, it's better to group what we searched.

    const [printingCustomer, setPrintingCustomer] = useState<any | null>(null);

    const [supplierInfo, setSupplierInfo] = useState<any>(null);

    useEffect(() => {
        // Fetch supplier info for printing
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.settings) {
                    setSupplierInfo({
                        supplier_name: data.settings.supplier_name,
                        supplier_ceo: data.settings.supplier_ceo,
                        supplier_info: data.settings // Pass full object if needed, or specific fields
                    });
                }
            });
    }, []);

    const performSearch = useCallback(async (currentSearchTerm: string) => {
        if (!currentSearchTerm.trim()) {
            setTransactions([]);
            setTotalCount(0);
            return;
        }

        setLoading(true);
        try {
            const query = new URLSearchParams({
                q: currentSearchTerm,
                page: "1",
                limit: "100" // Fetch enough records to show history
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
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, performSearch]);

    const handleDelete = async (rowId: number) => {
        if (!confirm("정말 이 거래 내역을 삭제하시겠습니까? (복구 불가)")) return;

        try {
            const response = await fetch(`/api/delete?rowId=${rowId}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (result.success) {
                alert("삭제되었습니다.");
                performSearch(searchTerm);
            } else {
                alert("삭제 실패: " + result.error);
            }

        } catch (error) {
            console.error("Delete failed:", error);
            alert("서버 오류로 삭제하지 못했습니다.");
        }
    };

    // Grouping logic
    const groupedCustomers = useMemo(() => {
        const groups: Record<string, any> = {};

        transactions.forEach(tx => {
            const key = `${tx.customerName || '알수없음'}_${tx.phone || 'no-phone'}`;
            if (!groups[key]) {
                groups[key] = {
                    customerName: tx.customerName,
                    customerNo: tx.customerNo,
                    phone: tx.phone,
                    address: tx.address,
                    transactions: []
                };
            }
            groups[key].transactions.push(tx);
        });

        return Object.values(groups);
    }, [transactions]);

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
                            고객 정보
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-20 pl-14 pr-12 bg-white/5 border border-[#D4AF37]/30 rounded-[2rem] text-xl font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Results List */}
                <div className="space-y-8">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4 text-[#D4AF37]">
                            <Loader2 className="w-12 h-12 animate-spin" />
                            <p className="text-lg font-bold animate-pulse">데이터 조회 중...</p>
                        </div>
                    ) : !searchTerm.trim() ? (
                        <div className="py-20 text-center space-y-4">
                            <div className="inline-flex p-6 bg-[#D4AF37]/5 rounded-full mb-2">
                                <Search size={40} className="text-[#D4AF37]/40" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400">조회할 고객의 <br />성함이나 전화번호를 입력하세요.</h3>
                        </div>
                    ) : groupedCustomers.length > 0 ? (
                        <>
                            <div className="px-2">
                                <p className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase">
                                    검색된 고객 <span className="text-white">{groupedCustomers.length}</span>명
                                </p>
                            </div>

                            {groupedCustomers.map((customer, cIdx) => (
                                <div
                                    key={cIdx}
                                    className="bg-white/5 border border-[#D4AF37]/20 rounded-[2.5rem] overflow-hidden gold-glow"
                                >
                                    {/* Customer Profile Header */}
                                    <div className="p-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-b border-[#D4AF37]/10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-[#D4AF37] p-4 rounded-3xl text-[#0D0B14]">
                                                    <User size={32} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-[#D4AF37]/60 font-black uppercase tracking-widest mb-1 pl-1">성명</div>
                                                    <h3 className="text-3xl font-black text-white leading-tight">{customer.customerName}</h3>
                                                    <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-sm mt-1">
                                                        <span className="text-[10px] opacity-50 font-black tracking-widest uppercase">고객번호:</span>
                                                        {customer.customerNo || "미등록 고객"}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setPrintingCustomer(customer)}
                                                className="bg-[#D4AF37]/10 p-3 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D0B14] transition-all shadow-lg"
                                                title="거래 명세서 출력"
                                            >
                                                <Printer size={24} />
                                            </button>
                                        </div>

                                        <div className="space-y-4 pl-2">
                                            <div className="flex items-center gap-4 text-xl font-bold text-white/90">
                                                <div className="flex items-center gap-2 min-w-[70px] text-gray-500 text-[11px] font-black uppercase tracking-widest border border-white/10 px-2 py-1.5 rounded-lg bg-white/5">
                                                    <Phone size={14} className="text-[#D4AF37]" />
                                                    전화
                                                </div>
                                                {customer.phone}
                                            </div>
                                            {customer.address && (
                                                <div className="flex items-start gap-4 text-base text-gray-400 font-medium">
                                                    <div className="flex items-center gap-2 min-w-[70px] text-gray-500 text-[11px] font-black uppercase tracking-widest border border-white/10 px-2 py-1.5 rounded-lg bg-white/5 mt-0.5">
                                                        <MapPin size={14} className="text-[#D4AF37]" />
                                                        주소
                                                    </div>
                                                    <span className="pt-1">{customer.address}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Transaction History */}
                                    <div className="p-6 space-y-4 bg-black/20">
                                        <div className="flex items-center gap-2 px-2 pb-2 border-b border-white/5">
                                            <ReceiptText size={16} className="text-gray-500" />
                                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">거래 내역 ({customer.transactions.length})</span>
                                        </div>

                                        <div className="space-y-4">
                                            {customer.transactions.map((tx: any, tIdx: number) => (
                                                <div key={tIdx} className="bg-white/5 rounded-[2rem] p-6 group/item hover:bg-white/10 transition-all border border-white/5 hover:border-[#D4AF37]/30">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1 space-y-4">
                                                            {/* Date & Product Header */}
                                                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-black ${(tx.transactionType === '판매' || !tx.transactionType)
                                                                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                                                        : 'bg-slate-700 text-slate-300'
                                                                        }`}>
                                                                        {tx.transactionType || '판매'}
                                                                    </span>
                                                                    <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-black uppercase tracking-tighter">
                                                                        <Calendar size={14} />
                                                                        <span className="opacity-50">거래일:</span>
                                                                        {tx.saleDate}
                                                                    </div>
                                                                </div>
                                                                <div className="text-xl font-black text-white flex items-center gap-2">
                                                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">품목:</span>
                                                                    {tx.productName}
                                                                </div>
                                                            </div>

                                                            {/* Pricing Layout */}
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1">단가/수량</p>
                                                                    <p className="text-base font-bold text-gray-200 pl-1">
                                                                        ₩{tx.unitPrice?.toLocaleString()} <span className="text-[#D4AF37]/60 ml-1">× {tx.quantity}</span>
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1 text-right">
                                                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest pr-1">최종 판매금액</p>
                                                                    <p className="text-2xl font-black text-[#D4AF37] gold-text-gradient">
                                                                        ₩{tx.totalAmount?.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Detailed breakdown (optional/smaller) */}
                                                            <div className="flex justify-between items-center text-[10px] bg-black/20 rounded-xl px-4 py-2 text-gray-500 font-bold border border-white/5">
                                                                <span>공급가액: ₩{tx.supplyAmount?.toLocaleString()}</span>
                                                                <div className="w-px h-2 bg-white/10"></div>
                                                                <span>부가세: ₩{tx.vat?.toLocaleString()}</span>
                                                            </div>

                                                            {/* Remarks - Styled for character/note look */}
                                                            {tx.remarks && (
                                                                <div className="relative mt-2 p-5 bg-[#D4AF37]/5 rounded-2xl border-l-4 border-[#D4AF37] group-hover/item:bg-[#D4AF37]/10 transition-colors">
                                                                    <div className="absolute top-3 right-4 opacity-10">
                                                                        <FileText size={40} />
                                                                    </div>
                                                                    <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                        <FileText size={12} /> 비고 / 참고사항
                                                                    </p>
                                                                    <p className="text-base font-medium text-gray-200 leading-relaxed relative z-10 whitespace-pre-wrap">
                                                                        {tx.remarks}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDelete(tx.rowId)}
                                                            className="p-3 text-red-400 opacity-20 group-hover/item:opacity-100 hover:bg-red-400/10 rounded-xl transition-all ml-4"
                                                            title="삭제"
                                                        >
                                                            <Trash2 size={24} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="py-20 text-center space-y-4 opacity-50">
                            <div className="inline-flex p-6 bg-white/5 rounded-full mb-2">
                                <Search size={40} className="text-gray-500" />
                            </div>
                            <p className="text-xl font-bold text-gray-400">"{searchTerm}"에 대한<br /> 검색 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Print Modal */}
            {printingCustomer && (
                <TransactionStatement
                    customer={printingCustomer}
                    transactions={printingCustomer.transactions}
                    supplierInfo={supplierInfo?.supplier_info} // Pass supplier info
                    onClose={() => setPrintingCustomer(null)}
                />
            )}
        </div>
    );
}
