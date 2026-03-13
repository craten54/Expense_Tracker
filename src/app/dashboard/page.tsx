"use client";
import { useEffect, useState } from "react";
import { getLogo } from "@/lib/utils";
import { useSession } from "next-auth/react";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Eye,
    EyeOff,
    Landmark,
    TrendingUp
} from "lucide-react";
// Import Recharts
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function DashboardPage() {
    const { data: session } = useSession();
    const [summary, setSummary] = useState<{ balance: number; walletDetails: any[] } | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBalance, setShowBalance] = useState(false);

    const nickname = session?.user?.name?.split(" ")[0] || "User";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resSummary, resTx] = await Promise.all([
                    fetch("/api/dashboard/summary"),
                    fetch("/api/transactions/recent")
                ]);
                if (resSummary.ok) setSummary(await resSummary.json());
                if (resTx.ok) setTransactions(await resTx.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter transaksi untuk Income vs Expense
    const incomeTxs = transactions.filter(tx => tx.type === "INCOME").slice(0, 3);
    const expenseTxs = transactions.filter(tx => tx.type === "EXPENSE").slice(0, 3);

    // Data untuk Pie Chart
    const totalIncome = transactions.filter(tx => tx.type === "INCOME").reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter(tx => tx.type === "EXPENSE").reduce((acc, curr) => acc + curr.amount, 0);
    
    const chartData = [
        { name: 'Pemasukan', value: totalIncome || 1 }, // || 1 biar chart ga ilang klo kosong
        { name: 'Pengeluaran', value: totalExpense || 1 },
    ];
    const COLORS = ['#10b981', '#DC2626']; // Hijau & Biru

    const formatCurrency = (amount: number) => {
        return showBalance ? `Rp ${amount.toLocaleString("id-ID")}` : "Rp ••••••••";
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Memetakan dana...</div>;

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* 1. TOP SECTION: BALANCE & PIE CHART */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Saldo Utama */}
                    <div className="lg:col-span-2 bg-blue-600 p-8 rounded-3xl shadow-lg shadow-blue-100 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-between items-center max-w-[220px]">
                                <p className="text-blue-100 text-sm font-medium">Total Saldo (Semua Akun)</p>
                                <button onClick={() => setShowBalance(!showBalance)} className="bg-white/10 p-1.5 rounded-lg">
                                    {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                            <h2 className="text-5xl font-bold mt-2">{formatCurrency(summary?.balance || 0)}</h2>
                        </div>
                        <Wallet className="absolute right-[-20px] bottom-[-20px] opacity-10" size={150} />
                    </div>

                    {/* PIE CHART BOX */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">Rasio Arus Kas</h3>
                        <div className="w-full h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-4 text-[10px] font-bold mt-2">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> INCOME</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-600"/> EXPENSE</div>
                        </div>
                    </div>
                </div>

                {/* 2. MIDDLE SECTION: WALLETS & DUAL HISTORY */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Daftar Dompet */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="font-bold text-slate-800 px-2">Daftar Akun</h3>
                        {summary?.walletDetails?.map((wallet, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                        {getLogo(wallet.name) ? <img src={getLogo(wallet.name)} className="w-6 h-6 object-contain" /> : <Landmark size={20}/>}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700">{wallet.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase">{wallet.type}</p>
                                    </div>
                                </div>
                                <p className="text-xs font-bold">{formatCurrency(wallet.balance)}</p>
                            </div>
                        ))}
                    </div>

                    {/* RIWAYAT INCOME */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-emerald-600 font-bold text-sm mb-6 flex items-center gap-2">
                            <ArrowUpRight size={18} /> Pemasukan Terakhir
                        </h3>
                        <div className="space-y-4">
                            {incomeTxs.map((tx, i) => (
                                <HistoryItem key={i} tx={tx} color="text-emerald-600" bg="bg-emerald-50" />
                            ))}
                        </div>
                    </div>

                    {/* RIWAYAT EXPENSE */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-red-600 font-bold text-sm mb-6 flex items-center gap-2">
                            <ArrowDownLeft size={18} /> Pengeluaran Terakhir
                        </h3>
                        <div className="space-y-4">
                            {expenseTxs.map((tx, i) => (
                                <HistoryItem key={i} tx={tx} color="text-red-600" bg="bg-red-50" />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function HistoryItem({ tx, color, bg }: any) {
    return (
        <div className="flex justify-between items-center group">
            <div className="flex gap-4 items-center">
                {/* Icon Box */}
                <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                    <TrendingUp size={16}/>
                </div>
                
                {/* Teks Bertingkat sesuai mau kamu, Stan */}
                <div className="flex flex-col min-w-0">
                    {/* 1. Nama Kategori (Judul Utama) */}
                    <span className="text-sm font-bold text-slate-700 truncate">
                        {tx.category?.name || "Lain-lain"}
                    </span>
                    
                    {/* 2. Keterangan (Abu-abu, Kecil, Miring) */}
                    <span className="text-[10px] text-slate-500 italic truncate leading-tight">
                        {tx.description || "Tanpa keterangan"}
                    </span>
                    
                    {/* 3. Tanggal */}
                    <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            {/* Nominal */}
            <p className={`text-sm font-black ${color} shrink-0 ml-2`}>
                {tx.type === 'INCOME' ? '+' : '-'} {tx.amount.toLocaleString("id-ID")}
            </p>
        </div>
    );
}