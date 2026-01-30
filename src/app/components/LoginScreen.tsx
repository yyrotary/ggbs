"use client";

import { useState, useEffect } from "react";
import { Unlock, Delete } from "lucide-react";

interface LoginScreenProps {
    onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleNumberClick = (num: number) => {
        if (pin.length < 6) {
            setPin((prev) => prev + num);
            setError(false);
        }
    };

    const handleDelete = () => {
        setPin((prev) => prev.slice(0, -1));
        setError(false);
    };

    const handleClear = () => {
        setPin("");
        setError(false);
    };

    const handleSubmit = async () => {
        if (pin.length !== 6) return;
        setLoading(true);
        try {
            // Optimistic check for quick feedback if length is right, 
            // effectively handled by useEffect anyway.
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: pin }),
            });
            const data = await res.json();
            if (data.success) {
                onLoginSuccess();
            } else {
                setError(true);
                setPin("");
            }
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pin.length === 6) {
            handleSubmit();
        }
    }, [pin]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#0D0B14] flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="max-w-sm w-full bg-[#1A1625] border border-[#D4AF37]/20 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-[#D4AF37]/10 mb-4 border border-[#D4AF37]/30">
                        <Unlock size={32} className="text-[#D4AF37]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">로그인</h2>
                    <p className="text-slate-400">간편 비밀번호 6자리를 입력하세요</p>
                    <p className="text-xs text-slate-600 mt-2">(초기: 123456)</p>
                </div>

                {/* PIN Display */}
                <div className="flex justify-center gap-4 mb-8">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${i < pin.length
                                    ? "bg-[#D4AF37] scale-110 shadow-[0_0_10px_#D4AF37]"
                                    : "bg-slate-700"
                                } ${error ? "bg-red-500 animate-pulse" : ""}`}
                        />
                    ))}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num)}
                            disabled={loading}
                            className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-2xl font-bold text-white border border-white/5"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleClear}
                        disabled={loading}
                        className="h-16 rounded-2xl bg-white/5 hover:bg-red-500/20 active:scale-95 transition-all text-lg font-bold text-red-400 border border-white/5"
                    >
                        C
                    </button>
                    <button
                        onClick={() => handleNumberClick(0)}
                        disabled={loading}
                        className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-2xl font-bold text-white border border-white/5"
                    >
                        0
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-white border border-white/5 flex items-center justify-center"
                    >
                        <Delete size={24} />
                    </button>
                </div>
                {error && <p className="text-red-500 text-center text-sm font-medium animate-bounce">비밀번호가 올바르지 않습니다.</p>}
            </div>
        </div>
    );
}
