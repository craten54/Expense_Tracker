"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [data, setData] = useState<{ balance: number; walletDetails: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Memanggil "mesin" API yang kita buat tadi
        fetch("/api/dashboard/summary")
        .then((res) => res.json())
        .then((resData) => {
            setData(resData);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8">Sabar ya, lagi ngitung duit...</div>;

    return (
        <div className="p-8 bg-slate-50 min-h-screen text-slate-800">
        <h1 className="text-2xl font-bold mb-6">Ringkasan Finansial</h1>
        
        {/* Kartu Saldo Total */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-sm">
            <p className="text-sm text-slate-500 font-medium">Total Saldo (Semua Akun)</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
            Rp {data?.balance.toLocaleString("id-ID") || 0}
            </h2>
        </div>

        {/* List Wallet (Bank/E-Wallet) */}
        <div className="mt-8">
            <h3 className="font-semibold mb-4">Daftar Akun Kamu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.walletDetails?.map((wallet, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between">
                <div>
                    <p className="font-bold">{wallet.name}</p>
                    <p className="text-xs text-slate-400">{wallet.type}</p>
                </div>
                <p className="font-mono font-bold">Rp {wallet.balance.toLocaleString("id-ID")}</p>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
}