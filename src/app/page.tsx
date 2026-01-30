"use client";

import { useState } from "react";
import { UserPlus, Search, Printer, Diamond, Bell, ChevronRight, ShieldCheck, Globe, Home, Database, Layers, Settings } from "lucide-react";
import RegistrationForm from "./components/RegistrationForm";
import LookupScreen from "./components/LookupScreen";
import StatsScreen from "./components/StatsScreen";
import LoginScreen from "./components/LoginScreen";
import SettingsScreen from "./components/SettingsScreen";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"home" | "register" | "lookup" | "stats" | "settings">("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <main className="min-h-screen font-sans selection:bg-primary/30">
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
                <button
                  onClick={() => setActiveTab("settings")}
                  className="bg-white/5 p-3 rounded-full border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors gold-glow"
                >
                  <Settings size={28} className="text-[#D4AF37]" />
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
                    <h3 className="text-3xl font-black text-white leading-snug">거래 등록</h3>
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
      {activeTab === "settings" && (
        <SettingsScreen onBack={() => setActiveTab("home")} />
      )}
    </main>
  );
}
