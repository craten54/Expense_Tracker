"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
    LayoutDashboard,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    BarChart3,
    History,
    LogOut,
    Edit2,
    Map // Import icon Map sebagai fallback atau hiasan
} from "lucide-react";

import EditProfileModal from "@/components/EditProfileModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session, update } = useSession();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const menuItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Manajemen Akun", href: "/dashboard/accounts", icon: Wallet },
        { name: "Pemasukan", href: "/dashboard/income", icon: ArrowUpCircle },
        { name: "Pengeluaran", href: "/dashboard/expense", icon: ArrowDownCircle },
        { name: "Analisis Pareto", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "Recap Tahunan", href: "/dashboard/recap", icon: History },
    ];

    const handleLogout = () => signOut({ callbackUrl: "/" });

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* SIDEBAR */}
            <aside className="w-72 bg-white border-r border-slate-100 flex flex-col fixed h-full z-40">
                {/* Logo CashMap di Sidebar */}
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <img
                        src="/logos/cashmap_logo.png" // Pastikan file ada di folder public
                        alt="CashMap Logo"
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                            console.log("Duh, logo masih gak ketemu Stan!");
                            // Fallback kalau gambar masih gak muncul
                            (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/854/854878.png";
                        }}
                    />
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            CashMap<span className="text-blue-600"></span>
                        </h1>
                    </div>
                </div>

                {/* Navigasi Utama */}
                <nav className="flex-1 p-4 pt-8 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3.5 p-3.5 rounded-2xl text-sm font-semibold transition-all group ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                                        : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                <Icon size={20} className={isActive ? "" : "text-slate-400 group-hover:text-blue-500"} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* PROFIL & LOGOUT - ANTI NUMPUK & ANTI GAMBAR PECAH */}
                <div className="p-4 border-t border-slate-100 mt-auto bg-white/80 backdrop-blur-sm sticky bottom-0">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        
                        <div className="flex items-center gap-3 cursor-pointer group flex-1" onClick={() => setIsEditModalOpen(true)}>
                            {/* Avatar Container */}
                            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-slate-200 relative group-hover:border-blue-300 transition-all flex items-center justify-center bg-blue-100 shrink-0">
                                {session?.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session?.user?.name || "User"}
                                        className="w-full h-full object-cover z-10"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : null}

                                {/* Fallback Initial (Di bawah foto/z-0) */}
                                <span className="absolute inset-0 flex items-center justify-center font-bold text-blue-600 text-base uppercase">
                                    {session?.user?.name?.[0] || "U"}
                                </span>
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-20">
                                    <Edit2 className="text-white" size={14} />
                                </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 text-xs truncate">
                                    {session?.user?.name || "Tamu"}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate font-mono">
                                    {session?.user?.email?.split('@')[0]}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-full text-red-500 hover:bg-red-50 transition-all group shrink-0"
                            title="Logout"
                        >
                            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT Area */}
            <main className="ml-72 flex-1 min-h-screen">
                {children}
            </main>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)} 
                user={session?.user}
                onUpdate={update}
            />
        </div>
    );
}