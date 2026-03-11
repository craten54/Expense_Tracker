"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    BarChart3,
    History,
    LogOut
    } from "lucide-react";

    export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Manajemen Akun", href: "/dashboard/accounts", icon: Wallet },
        { name: "Pemasukan", href: "/dashboard/income", icon: ArrowUpCircle },
        { name: "Pengeluaran", href: "/dashboard/expense", icon: ArrowDownCircle },
        { name: "Analisis Pareto", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "Recap Tahunan", href: "/dashboard/recap", icon: History },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
            <div className="p-6 border-b border-slate-100">
            <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                ET-Pareto 📈
            </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    <Icon size={18} />
                    {item.name}
                </Link>
                );
            })}
            </nav>

            <div className="p-4 border-t border-slate-100">
            <button className="flex items-center gap-3 p-3 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all">
                <LogOut size={18} />
                Logout
            </button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="ml-64 flex-1 p-8">
            {/* Header di atas konten */}
            <header className="flex justify-between items-center mb-8">
            <div>
                <p className="text-sm text-slate-500">Halo, Stan Fredheric!</p>
                <h2 className="text-xl font-bold text-slate-800">Selamat Datang Kembali</h2>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                S
            </div>
            </header>

            {children}
        </main>
        </div>
    );
}