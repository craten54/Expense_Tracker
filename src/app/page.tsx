// src/app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Expense Tracker Pareto
        </h1>
        <p className="text-lg text-slate-400 mb-8">
          Kelola keuangan pribadi dengan analisis Pareto 80/20. Pantau pengeluaran bulanan dan tahunan secara presisi.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-500/30"
          >
            Masuk ke Dashboard
          </Link>
          <button className="border border-slate-700 hover:bg-slate-800 px-8 py-3 rounded-full font-bold transition-all">
            Pelajari Fitur
          </button>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-50">
        <div className="text-center">
          <p className="text-2xl font-bold">80/20</p>
          <p className="text-sm text-slate-500">Pareto Analysis</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">Real-time</p>
          <p className="text-sm text-slate-500">PostgreSQL Data</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">Secure</p>
          <p className="text-sm text-slate-500">Next.js Server Actions</p>
        </div>
      </div>
    </div>
  );
}