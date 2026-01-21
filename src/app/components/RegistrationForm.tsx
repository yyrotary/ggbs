"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
    Calendar, User, Phone, MapPin,
    CreditCard, FileText, Printer,
    ArrowLeft, Hash, Diamond, Bell, Receipt, ShoppingBag, Tag
} from "lucide-react";

export default function RegistrationForm({ onBack }: { onBack: () => void }) {
    const [formData, setFormData] = useState({
        saleDate: new Date().toISOString().split("T")[0],
        customerName: "",
        customerNo: "",
        phone: "",
        address: "",
        productName: "",
        unitPrice: 0,
        quantity: 1,
        remarks: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [focusedField, setFocusedField] = useState<"customerName" | "phone" | null>(null);

    const fetchNextCustomerNo = useCallback(async () => {
        try {
            const response = await fetch("/api/next-customer-no");
            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, customerNo: data.nextNo }));
            }
        } catch (error) {
            console.error("Failed to fetch next customer number:", error);
        }
    }, []);

    useEffect(() => {
        fetchNextCustomerNo();
    }, [fetchNextCustomerNo]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            const hasName = formData.customerName.trim().length >= 1;
            const hasPhone = formData.phone.trim().length >= 1;

            if (hasName || hasPhone) {
                try {
                    const query = new URLSearchParams({
                        name: formData.customerName,
                        phone: formData.phone
                    }).toString();

                    const response = await fetch(`/api/lookup?${query}`);
                    const data = await response.json();
                    if (data.success && data.results.length > 0) {
                        const unique = data.results.reduce((acc: any[], curr: any) => {
                            if (!acc.find(item => item.customerName === curr.customerName && item.phone === curr.phone)) {
                                acc.push(curr);
                            }
                            return acc;
                        }, []);
                        setSearchResults(unique);
                        setShowResults(true);
                    } else {
                        setSearchResults([]);
                        setShowResults(false);
                    }
                } catch (error) {
                    console.error("Search failed:", error);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [formData.customerName, formData.phone]);

    const handleSelectCustomer = (customer: any) => {
        setFormData(prev => ({
            ...prev,
            customerName: customer.customerName,
            customerNo: customer.customerNo,
            phone: customer.phone,
            address: customer.address,
        }));
        setShowResults(false);
    };

    const calculations = useMemo(() => {
        const supplyAmount = formData.unitPrice * formData.quantity;
        const vat = Math.floor(supplyAmount * 0.1);
        const totalAmount = supplyAmount + vat;
        return { supplyAmount, vat, totalAmount };
    }, [formData.unitPrice, formData.quantity]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "unitPrice" || name === "quantity" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, ...calculations }),
            });

            const result = await response.json();
            if (result.success) {
                alert("거래가 성공적으로 저장되었습니다.");
                setFormData({
                    saleDate: new Date().toISOString().split("T")[0],
                    customerName: "",
                    customerNo: "",
                    phone: "",
                    address: "",
                    productName: "",
                    unitPrice: 0,
                    quantity: 1,
                    remarks: "",
                });
                fetchNextCustomerNo();
            } else {
                throw new Error(result.error || "Failed to save transaction.");
            }
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0B14] text-white pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sticky Header - Premium Style */}
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
                            판매 등록
                        </h2>
                    </div>
                    <div className="size-12"></div> {/* Spacer for alignment */}
                </div>
            </div>

            <main className="max-w-lg mx-auto space-y-8 px-6 py-8">
                <form id="salesForm" onSubmit={handleSubmit} className="space-y-8">
                    {/* 1. 판매일자 */}
                    <FormField label="판매일자" icon={<Calendar size={20} />}>
                        <input
                            type="date"
                            name="saleDate"
                            value={formData.saleDate}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-2xl h-16 px-6 text-xl font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                            required
                        />
                    </FormField>

                    {/* 2. 고객명 */}
                    <FormField label="고객명" icon={<User size={20} />}>
                        <div className="relative">
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                onFocus={() => setFocusedField("customerName")}
                                placeholder="고객 성함"
                                className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-2xl h-16 px-6 text-xl font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-gray-600"
                                autoComplete="off"
                                required
                            />
                            {showResults && focusedField === "customerName" && searchResults.length > 0 && (
                                <SearchResultsDropdown results={searchResults} onSelect={handleSelectCustomer} />
                            )}
                        </div>
                    </FormField>

                    {/* 3. 고객번호 */}
                    <FormField label="고객번호" icon={<Hash size={20} />}>
                        <input
                            type="text"
                            name="customerNo"
                            value={formData.customerNo}
                            readOnly
                            className="w-full bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-2xl h-16 px-6 text-xl font-bold text-[#D4AF37] outline-none"
                        />
                    </FormField>

                    {/* 4. 전화번호 */}
                    <FormField label="전화번호" icon={<Phone size={20} />}>
                        <div className="relative">
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onFocus={() => setFocusedField("phone")}
                                placeholder="010-0000-0000"
                                className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-2xl h-16 px-6 text-xl font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-gray-600"
                                required
                            />
                            {showResults && focusedField === "phone" && searchResults.length > 0 && (
                                <SearchResultsDropdown results={searchResults} onSelect={handleSelectCustomer} />
                            )}
                        </div>
                    </FormField>

                    {/* 5. 주소 */}
                    <FormField label="주소" icon={<MapPin size={20} />}>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="주소 입력"
                            className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-2xl h-16 px-6 text-xl font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-gray-600"
                        />
                    </FormField>

                    {/* 6. 물품명 */}
                    <FormField label="물품명" icon={<Tag size={20} />}>
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            placeholder="예: 순금 반지"
                            className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-2xl h-16 px-6 text-xl font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-gray-600"
                            required
                        />
                    </FormField>

                    {/* 7. 단가 & 8. 수량 */}
                    <div className="grid grid-cols-2 gap-6">
                        <FormField label="단가" icon={<CreditCard size={20} />}>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="unitPrice"
                                    value={formData.unitPrice || ""}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-2xl h-16 pl-8 pr-4 text-xl font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-gray-600"
                                    required
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₩</span>
                            </div>
                        </FormField>
                        <FormField label="수량" icon={<ShoppingBag size={20} />}>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="1"
                                className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-2xl h-16 px-4 text-xl font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-gray-600 text-center"
                                required
                            />
                        </FormField>
                    </div>

                    {/* 9. 공급가액, 10. 부가세액, 11. 판매금액 */}
                    <div className="bg-gradient-to-br from-[#2D2616] to-[#0D0B14] rounded-3xl p-8 border border-[#D4AF37]/30 space-y-5 gold-glow">
                        <div className="flex justify-between items-center text-lg font-medium text-gray-400">
                            <span>공급가액</span>
                            <span className="text-white font-bold">₩ {calculations.supplyAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-medium text-gray-400">
                            <span>부가세액</span>
                            <span className="text-white font-bold">₩ {calculations.vat.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-[#D4AF37]/30 w-full my-2"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-black tracking-tight text-[#D4AF37]">판매금액</span>
                            <span className="text-[#D4AF37] text-3xl font-black tabular-nums gold-text-gradient">₩ {calculations.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* 12. 비고 */}
                    <FormField label="비고" icon={<FileText size={20} />}>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="참고 사항"
                            className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-6 text-xl font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all min-h-[120px] resize-none placeholder:text-gray-600"
                        />
                    </FormField>
                </form>
            </main>

            {/* Sticky Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0D0B14]/95 backdrop-blur-xl border-t border-[#D4AF37]/20 no-print z-40">
                <div className="max-w-lg mx-auto flex gap-4">
                    <button
                        form="salesForm"
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#D4AF37] text-[#0D0B14] text-xl font-black py-5 rounded-2xl shadow-lg shadow-[#D4AF37]/20 hover:bg-[#F9E498] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-4 border-[#0D0B14]/30 border-t-[#0D0B14] rounded-full animate-spin" />
                        ) : (
                            <>
                                <Receipt size={24} strokeWidth={2.5} />
                                거래 완료
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="p-5 bg-white/5 text-[#D4AF37] hover:bg-white/10 border border-[#D4AF37]/30 rounded-2xl transition-all"
                    >
                        <Printer size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-[#D4AF37] text-sm font-black leading-normal px-1 uppercase tracking-widest flex items-center gap-2">
                <span className="opacity-80">{icon}</span>
                {label}
            </p>
            {children}
        </div>
    );
}
function SearchResultsDropdown({ results, onSelect }: { results: any[]; onSelect: (c: any) => void }) {
    return (
        <div className="absolute z-50 w-full mt-2 bg-[#1A1625] border border-[#D4AF37]/30 rounded-2xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {results.map((customer, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => onSelect(customer)}
                    className="w-full p-5 text-left hover:bg-[#D4AF37]/10 transition-all flex flex-col border-b border-[#D4AF37]/10 last:border-0"
                >
                    <span className="text-lg font-bold text-white mb-1">{customer.customerName}</span>
                    <span className="text-sm text-gray-400 uppercase tracking-widest font-medium">{customer.customerNo} · {customer.phone}</span>
                </button>
            ))}
        </div>
    );
}
