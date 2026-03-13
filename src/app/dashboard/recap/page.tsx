"use client";
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RecapPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("/api/analytics/recap")
        .then(res => res.json())
        .then(json => setData(json));
    }, []);

    return (
        <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800">Recap Tahunan 🗓️</h2>
            <p className="text-slate-500">Pantau tren pengeluaranmu sepanjang tahun {new Date().getFullYear()}.</p>

            <div className="h-[400px] w-full mt-10">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#64748b', fontSize: 12}}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#64748b'}}
                    tickFormatter={(value) => `Rp ${value.toLocaleString()}`}
                />
                <Tooltip
                    formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Pengeluaran']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    strokeWidth={3}
                />
                </AreaChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* Info Card Tambahan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* KARTU 1: BULAN TERBOROS */}
        <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-100">
            <p className="text-blue-100 text-sm font-medium">Bulan Terboros</p>
            <h3 className="text-3xl font-bold mt-1">
            {data.length > 0 ? [...data].sort((a, b) => b.total - a.total)[0].month : "-"}
            </h3>
            <p className="text-blue-200 text-xs mt-2 uppercase tracking-wider font-semibold">
            Puncak Pengeluaran
            </p>
        </div>

        {/* KARTU 2: RATA-RATA BULANAN */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Rata-rata Bulanan</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-800">
            Rp {data.length > 0 
                ? (data.reduce((acc, curr) => acc + curr.total, 0) / data.filter(d => d.total > 0).length).toLocaleString() 
                : "0"}
            </h3>
            <p className="text-green-500 text-xs mt-2 font-semibold">
            Berdasarkan data aktif
            </p>
        </div>

        {/* KARTU 3: TOTAL TAHUNAN */}
        <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg shadow-slate-200">
            <p className="text-slate-400 text-sm font-medium">Total Pengeluaran 2026</p>
            <h3 className="text-2xl font-bold mt-1">
            Rp {data.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}
            </h3>
            <div className="mt-2 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[65%]" /> {/* Progress bar hiasan */}
            </div>
        </div>
        </div>
        </div>
    );
}