"use client";

import { useState } from "react";
import { UserPlus, Search, Printer, Diamond, Bell, ChevronRight, ShieldCheck, Globe, Home, Database, Layers, Settings } from "lucide-react";
import RegistrationForm from "./components/RegistrationForm";
import LookupScreen from "./components/LookupScreen";
import StatsScreen from "./components/StatsScreen";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"home" | "register" | "lookup" | "stats">("home");

  return (
    <main className="min-h-screen font-sans selection:bg-primary/30 pb-28">
      {activeTab === "home" && (
        <div className="max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-700">
          {/* Top Header */}
          <div className="sticky top-0 z-50 bg-[#0D0B14]/90 backdrop-blur-xl border-b border-[#D4AF37]/20">
            <div className="flex items-center p-6 justify-between">
              <div className="bg-gradient-to-br from-[#F9E498] to-[#996515] p-3 rounded-2xl shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                <Diamond size={32} className="text-[#0D0B14] fill-[#0D0B14]" strokeWidth={1.5} />
              </div>
              <h1 className="gold-text-gradient text-3xl font-extrabold tracking-tight uppercase font-display">
                금가보석
              </h1>
              <div className="flex items-center gap-3">
                <button className="bg-white/5 p-3 rounded-full border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors gold-glow">
                  <Bell size={28} className="text-[#D4AF37]" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-10">
            {/* Hero Section */}
            <header className="space-y-4 text-center py-4">
              <h2 className="text-5xl font-extrabold leading-[1.2] tracking-tight text-white">
                품격 있는 <br />
                <span className="gold-text-gradient">고객 관리</span>
              </h2>
            </header>

            {/* Quick Actions - Large Buttons for Seniors */}
            <div className="grid gap-6">
              {/* Sales Entry */}
              <button
                onClick={() => setActiveTab("register")}
                className="w-full text-left p-8 rounded-[2.5rem] bg-gradient-to-br from-[#2D2616] to-[#0D0B14] gold-border-card gold-glow flex items-center justify-between group overflow-hidden shadow-2xl"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-gradient-to-br from-[#F9E498] to-[#996515] p-5 rounded-3xl shadow-lg text-[#0D0B14]">
                    <UserPlus size={40} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white leading-snug">판매 등록</h3>
                    <p className="text-[#D4AF37] text-lg font-medium opacity-90">새 고객 및 거래 입력</p>
                  </div>
                </div>
                <ChevronRight size={32} className="text-[#D4AF37] group-hover:translate-x-2 transition-transform opacity-70" />
              </button>

              {/* Customer Lookup */}
              <button
                onClick={() => setActiveTab("lookup")}
                className="w-full text-left p-8 rounded-[2.5rem] gold-border-card gold-glow flex items-center justify-between group transition-all hover:bg-white/5 shadow-xl"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-[#D4AF37]/10 p-5 rounded-3xl border border-[#D4AF37]/30 text-[#D4AF37]">
                    <Search size={40} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white leading-snug">고객 조회</h3>
                    <p className="text-slate-400 text-lg font-medium">이전 내역 찾아보기</p>
                  </div>
                </div>
                <ChevronRight size={32} className="text-slate-500 group-hover:translate-x-2 transition-transform group-hover:text-[#D4AF37]" />
              </button>

              {/* System Export */}
              <button
                onClick={() => setActiveTab("stats")}
                className="w-full text-left p-8 rounded-[2.5rem] gold-border-card gold-glow flex items-center justify-between group transition-all hover:bg-white/5 shadow-xl"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-[#D4AF37]/10 p-5 rounded-3xl border border-[#D4AF37]/30 text-[#D4AF37]">
                    <Printer size={40} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white leading-snug">통계·출력</h3>
                    <p className="text-slate-400 text-lg font-medium">매출 확인 및 인쇄</p>
                  </div>
                </div>
                <ChevronRight size={32} className="text-slate-500 group-hover:translate-x-2 transition-transform group-hover:text-[#D4AF37]" />
              </button>
            </div>
          </div>

          {/* Bottom Nav - Korean & Large */}
          <nav className="fixed bottom-0 left-0 right-0 bg-[#0D0B14]/95 backdrop-blur-2xl border-t-2 border-[#D4AF37]/20 pb-10 pt-5 z-50">
            <div className="max-w-lg mx-auto flex justify-around items-center px-6">
              <div className="flex flex-col items-center gap-2 text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
                <Home size={32} fill="currentColor" />
                <span className="text-sm font-black tracking-wide">홈</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors">
                <Database size={32} />
                <span className="text-sm font-black tracking-wide">보관함</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors">
                <Layers size={32} />
                <span className="text-sm font-black tracking-wide">목록</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors">
                <Settings size={32} />
                <span className="text-sm font-black tracking-wide">설정</span>
              </div>
            </div>
          </nav>
        </div>
      )}

      {activeTab === "register" && (
        <RegistrationForm onBack={() => setActiveTab("home")} />
      )}

      {activeTab === "lookup" && (
        <LookupScreen onBack={() => setActiveTab("home")} />
      )}
      {activeTab === "stats" && (
        <StatsScreen onBack={() => setActiveTab("home")} />
      )}
    </main>
  );
}
