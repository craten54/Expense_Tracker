"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, PieChart, Wallet, Zap, CheckCircle2, Moon, Sun } from "lucide-react";

export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-blue-100 ${isDark ? "bg-[#0B0F1A] text-white" : "bg-white text-slate-900"}`}>
      
      {/* 1. NAVBAR */}
      <nav className={`max-w-7xl mx-auto px-6 py-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md transition-colors ${isDark ? "bg-[#0B0F1A]/80 border-b border-white/5" : "bg-white/80 border-b border-slate-100"}`}>
        <div className="flex items-center gap-2">
          <img src="/logos/cashmap_logo.png" alt="Logo" className="w-9 h-9" />
          <span className="text-xl font-bold tracking-tight">
            CashMap
          </span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all ${isDark ? "bg-slate-800 text-yellow-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link href="/login" className={`text-sm font-semibold transition-colors ${isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-blue-600"}`}>
            Login
          </Link>
          <Link href="/register" className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg ${isDark ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20" : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"}`}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="animate-in fade-in slide-in-from-left duration-1000">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
            Your Money, Your Control.
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 text-balance">
            Take Control of Your <br />
            <span className="text-blue-600">Financial Future.</span>
          </h1>
          <p className={`text-lg md:text-xl max-w-lg mb-10 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Kelola pengeluaran, pantau saldo berbagai akun, dan temukan pola jajanmu secara otomatis dalam satu aplikasi cerdas.
          </p>
          <div>
            <Link href="/register" className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2 shadow-xl shadow-blue-600/20 group">
              Mulai Sekarang <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        {/* RIGHT: CLEAN PHONE MOCKUP */}
        <div className="flex justify-center items-center relative lg:justify-end">
          {/* Glow di belakang tetap ada biar pop-out */}
          <div className={`absolute w-80 h-[500px] rounded-full blur-[120px] -z-10 transition-colors ${isDark ? "bg-blue-500/30" : "bg-blue-600/10"}`} />

          {/* Body Hape */}
          <div className={`relative w-[300px] h-[610px] rounded-[3.5rem] border-[10px] shadow-2xl overflow-hidden transition-all duration-700 
              ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-zinc-950"}`}>
              
              {/* Notch (Z-index 50 biar di atas gambar) */}
              <div className="absolute top-0 inset-x-0 h-7 bg-zinc-950 rounded-b-3xl w-1/2 mx-auto z-50 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <div className="w-8 h-1 rounded-full bg-zinc-800" />
              </div>

              {/* AREA SCREEN - Dibuat Full Tanpa Padding */}
              <div className="w-full h-full relative bg-white">
                  {/* Gambar SS Dashboard dibuat Full (w-full h-full) */}
                  <img
                      src="/logos/ss.png"
                      alt="CashMap Dashboard"
                      className="w-full h-full object-cover object-top animate-in fade-in duration-700"
                  />
                  
                  {/* Overlay Glass Tipis (Biar kesan layar kacanya dapet) */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
              </div>

              {/* Home Bar (Z-index 50 biar di atas gambar) */}
              <div className="absolute bottom-1.5 inset-x-0 h-1 bg-zinc-900/50 rounded-full w-1/3 mx-auto z-50 shadow-sm" />
          </div>
      </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className={`py-24 px-6 transition-colors ${isDark ? "bg-[#0E131F]" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Utama CashMap</h2>
            <p className={`max-w-2xl mx-auto italic ${isDark ? "text-slate-500" : "text-slate-500"}`}>Kelola keuangan tanpa pusing dengan sistem pemetaan otomatis.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              isDark={isDark}
              icon={<PieChart size={24} className="text-blue-600" />}
              title="Pemetaan Pola"
              desc="Temukan kategori pengeluaran yang paling dominan secara otomatis tanpa ribet menghitung manual."
            />
            <FeatureCard
              isDark={isDark}
              icon={<Wallet size={24} className="text-blue-600" />}
              title="Multi-Account"
              desc="Hubungkan Bank, E-Wallet, dan Cash dalam satu dashboard terpusat yang aman."
            />
            <FeatureCard
              isDark={isDark}
              icon={<CheckCircle2 size={24} className="text-blue-600" />}
              title="Laporan Presisi"
              desc="Dapatkan insight mingguan dan bulanan yang akurat untuk menjaga kesehatan finansialmu."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, isDark }: { icon: any, title: string, desc: string, isDark: boolean }) {
  return (
    <div className={`p-10 rounded-[2rem] transition-all group border ${isDark ? "bg-slate-900 border-white/5 shadow-none hover:border-blue-500/50" : "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2"}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all ${isDark ? "bg-slate-800 group-hover:bg-blue-600" : "bg-blue-50 group-hover:bg-blue-600 group-hover:text-white"}`}>
        <span className="group-hover:text-white transition-colors">{icon}</span>
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className={`leading-relaxed ${isDark ? "text-slate-500" : "text-slate-500"}`}>{desc}</p>
    </div>
  );
}