"use client";
import { useEffect, useState } from "react";
import { Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ComposedChart, CartesianGrid } from 'recharts';

export default function AnalyticsPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("/api/analytics/pareto")
        .then(res => res.json())
        .then(json => setData(json));
    }, []);

    if (data.length === 0) return <div className="p-10 text-center text-slate-500">Belum ada data pengeluaran untuk dianalisis.</div>;

    return (
        <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Analisis Pareto (80/20 Rule)</h2>
            <p className="text-slate-500">Cek 20% kategori jajan yang menghabiskan 80% uangmu.</p>
        </div>

        <div className="h-[400px] w-full mt-10">
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} unit="%" />
                <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                {/* Tambahkan padding di YAxis agar garis merah tidak terlalu mepet ke border atas */}
                <YAxis yAxisId="right" orientation="right" domain={[0, 110]} unit="%" hide />

                {/* Perkecil ukuran bar agar tidak memenuhi layar kalau cuma sedikit kategori */}
                <Bar
                yAxisId="left"
                dataKey="value"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                barSize={data.length > 3 ? undefined : 100} // Dinamis: kalau dikit, batangnya jangan kegedean
                />
                {/* Tambahkan Line ini Stan supaya ada garis kumulatifnya */}
                <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulative"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 6, fill: '#ef4444' }}
                />
            </ComposedChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
}