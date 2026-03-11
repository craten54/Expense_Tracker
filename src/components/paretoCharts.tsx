"use client";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";


export default function ParetoChart({ data }: { data: any[] }) {
    if (data.length === 0) {
        return (
        <div className="bg-white p-20 rounded-xl border border-dashed border-slate-300 text-center">
            <p className="text-slate-500">Belum ada data transaksi untuk periode ini.</p>
        </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-6 text-slate-700">Pareto Pengeluaran (80/20)</h3>
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="total" name="Total Pengeluaran" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="cumulative" name="Persentase Kumulatif" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
            </ComposedChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
}