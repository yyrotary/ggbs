"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Save, Lock, Diamond } from "lucide-react";

interface SettingsScreenProps {
    onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
    const [supplierInfo, setSupplierInfo] = useState({
        supplier_name: "",
        supplier_ceo: "",
        supplier_reg_no: "",
        supplier_address: "",
        supplier_phone: ""
    });
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch current settings
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.settings) {
                    setSupplierInfo({
                        supplier_name: data.settings.supplier_name || "",
                        supplier_ceo: data.settings.supplier_ceo || "",
                        supplier_reg_no: data.settings.supplier_reg_no || "",
                        supplier_address: data.settings.supplier_address || "",
                        supplier_phone: data.settings.supplier_phone || ""
                    });
                }
            });
    }, []);

    const handleSavePassword = async () => {
        if (pin.length !== 6) {
            setMessage("6자리를 입력해주세요.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/settings/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: pin }),
            });
            if (res.ok) {
                setMessage("비밀번호가 변경되었습니다.");
                setTimeout(() => {
                    setMessage("");
                    setPin("");
                }, 2000);
            } else {
                setMessage("저장 실패");
            }
        } catch (e) {
            setMessage("오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSupplier = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings/supplier", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(supplierInfo),
            });
            if (res.ok) {
                setMessage("공급자 정보가 저장되었습니다.");
                setTimeout(() => setMessage(""), 2000);
            } else {
                setMessage("저장 실패");
            }
        } catch (e) {
            setMessage("오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto min-h-screen bg-[#0D0B14] text-white pb-20 animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-10 bg-[#0D0B14]/90 backdrop-blur-xl border-b border-[#D4AF37]/20 p-4 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-white/10 text-[#D4AF37] transition-colors"
                >
                    <ChevronLeft size={28} />
                </button>
                <h1 className="text-xl font-bold">환경 설정</h1>
            </div>

            <div className="p-6 space-y-8">
                {/* Supplier Info Section */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-[#D4AF37] flex items-center gap-2">
                        <Diamond size={20} />
                        공급자 정보 설정 (인쇄용)
                    </h2>
                    <div className="bg-[#1A1625] rounded-3xl p-6 border border-[#D4AF37]/20 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">상호 (Company Name)</label>
                            <input
                                type="text"
                                value={supplierInfo.supplier_name}
                                onChange={(e) => setSupplierInfo({ ...supplierInfo, supplier_name: e.target.value })}
                                className="w-full bg-[#0D0B14] border border-[#D4AF37]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">대표자 (CEO)</label>
                            <input
                                type="text"
                                value={supplierInfo.supplier_ceo}
                                onChange={(e) => setSupplierInfo({ ...supplierInfo, supplier_ceo: e.target.value })}
                                className="w-full bg-[#0D0B14] border border-[#D4AF37]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">사업자 등록번호</label>
                            <input
                                type="text"
                                value={supplierInfo.supplier_reg_no}
                                onChange={(e) => setSupplierInfo({ ...supplierInfo, supplier_reg_no: e.target.value })}
                                className="w-full bg-[#0D0B14] border border-[#D4AF37]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">주소 (Address)</label>
                            <input
                                type="text"
                                value={supplierInfo.supplier_address}
                                onChange={(e) => setSupplierInfo({ ...supplierInfo, supplier_address: e.target.value })}
                                className="w-full bg-[#0D0B14] border border-[#D4AF37]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">전화번호 (Phone)</label>
                            <input
                                type="text"
                                value={supplierInfo.supplier_phone}
                                onChange={(e) => setSupplierInfo({ ...supplierInfo, supplier_phone: e.target.value })}
                                className="w-full bg-[#0D0B14] border border-[#D4AF37]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>

                        <button
                            onClick={handleSaveSupplier}
                            disabled={loading}
                            className="w-full mt-4 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-[#0D0B14] transition-all"
                        >
                            <Save size={18} />
                            정보 저장
                        </button>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-[#D4AF37] flex items-center gap-2">
                        <Lock size={20} />
                        간편 비밀번호 설정
                    </h2>
                    <div className="bg-[#1A1625] rounded-3xl p-6 border border-[#D4AF37]/20 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">새로운 비밀번호 (6자리)</label>
                            <input
                                type="text"
                                maxLength={6}
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                                className="w-full bg-[#0D0B14] border border-[#D4AF37]/30 rounded-xl p-4 text-2xl tracking-[0.5em] text-center focus:outline-none focus:border-[#D4AF37] transition-colors text-white"
                                placeholder="******"
                            />
                        </div>

                        <button
                            onClick={handleSavePassword}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#F9E498] to-[#996515] text-[#0D0B14] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50"
                        >
                            <Save size={20} />
                            {loading ? "저장 중..." : "비밀번호 변경"}
                        </button>
                    </div>
                </section>

                {message && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-[#D4AF37]/50 px-6 py-3 rounded-full text-[#D4AF37] font-bold animate-in fade-in slide-in-from-bottom-5">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
