"use client";
import { useState, useEffect } from "react";
import { ChevronDown, Wallet as WalletIcon, Landmark, TrendingUp, History } from "lucide-react";
import { getLogo } from "@/lib/utils";

export default function IncomePage() {
    const [wallets, setWallets] = useState<any[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Gaji/Uang Saku");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    
    // State untuk menyimpan data riwayat yang sudah dikelompokkan
    const [groupedHistory, setGroupedHistory] = useState<Record<string, any[]>>({});

    useEffect(() => {
        // Fetch data dompet
        fetch("/api/dashboard/summary").then(res => res.json()).then(data => {
            const list = data.walletDetails || [];
            setWallets(list);
            if (list.length > 0) setSelectedWallet(list[0]);
        });
        
        // Fetch data riwayat
        fetchHistory();
    }, []);

    // Logic untuk ambil data dan grouping per kategori
    const fetchHistory = async () => {
        try {
            const res = await fetch(`/api/transactions/recent`);
            if (res.ok) {
                const data = await res.json();
                const incomeOnly = data.filter((tx: any) => tx.type === "INCOME");

                const grouped = incomeOnly.reduce((acc: any, tx: any) => {
                    const catName = tx.category?.name || "Lain-lain";
                    if (!acc[catName]) acc[catName] = [];
                    acc[catName].push(tx);
                    return acc;
                }, {});

                setGroupedHistory(grouped);
            }
        } catch (err) {
            console.error("Gagal ambil riwayat:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedWallet) return alert("Pilih akun dulu, Stan!");
        
        setLoading(true);
        const res = await fetch("/api/transactions/income", {
            method: "POST",
            body: JSON.stringify({ 
                amount, 
                description, 
                walletId: Number(selectedWallet.id), 
                categoryName: category 
            }),
        });

        if (res.ok) {
            alert("Pemasukan berhasil dicatat!");
            setAmount("");
            setDescription("");
            fetchHistory(); // Update list riwayat otomatis
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 space-y-10 bg-slate-50 min-h-screen">
            {/* BOX FORM INPUT */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <header className="mb-8 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
                        Tambah Pemasukan <TrendingUp className="text-blue-600" />
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 italic">Cuan dari mana nih hari ini?</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* NOMINAL */}
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
                        <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">Nominal (Rp)</label>
                        <input 
                            type="number" required placeholder="0" value={amount}
                            className="w-full bg-transparent border-none text-4xl font-bold text-blue-600 focus:ring-0 p-0 mt-2 text-center"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* PILIH AKUN */}
                        <div className="relative">
                            <label className="text-sm font-semibold text-slate-600 block mb-2">Simpan ke Akun</label>
                            <div 
                                onClick={() => setIsWalletOpen(!isWalletOpen)}
                                className="w-full p-4 pl-12 bg-slate-50 rounded-xl border border-transparent hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between"
                            >
                                <div className="absolute left-4 w-6 h-6 flex items-center justify-center">
                                    {selectedWallet && getLogo(selectedWallet.name) ? (
                                        <img src={getLogo(selectedWallet.name)!} alt="" className="object-contain" />
                                    ) : (
                                        <WalletIcon className="text-slate-400" size={18} />
                                    )}
                                </div>
                                <span className="font-medium text-slate-700 truncate">
                                    {selectedWallet ? selectedWallet.name : "Pilih Akun..."}
                                </span>
                                <ChevronDown className={`text-slate-400 shrink-0 transition-transform ${isWalletOpen ? 'rotate-180' : ''}`} size={18} />
                            </div>

                            {isWalletOpen && (
                                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                                    {wallets.map((w) => (
                                        <div 
                                            key={w.id}
                                            onClick={() => { setSelectedWallet(w); setIsWalletOpen(false); }}
                                            className="p-4 hover:bg-blue-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-none"
                                        >
                                            <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                                {getLogo(w.name) ? <img src={getLogo(w.name)!} alt="" className="object-contain" /> : <Landmark className="text-blue-400" size={18} />}
                                            </div>
                                            <div className="flex-1 flex justify-between items-center text-slate-700">
                                                <span className="font-medium">{w.name}</span>
                                                <span className="text-[10px] font-mono">Rp {w.balance.toLocaleString("id-ID")}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PILIH KATEGORI */}
                        <div className="relative">
                            <label className="text-sm font-semibold text-slate-600 block mb-2">Kategori</label>
                            <select 
                                value={category}
                                className="w-full p-4 pl-12 bg-slate-50 rounded-xl appearance-none border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 cursor-pointer"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {["Gaji/Uang Saku", "Freelance", "Hadiah", "Lain-lain"].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-[70%] -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-600 block mb-2">Keterangan Tambahan</label>
                        <textarea 
                            value={description}
                            placeholder="Contoh: Fee project website"
                            className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                            rows={3}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-100 disabled:opacity-50"
                    >
                        {loading ? "Menyimpan..." : "Simpan Pemasukan"}
                    </button>
                </form>
            </div>

            {/* --- BAGIAN RIWAYAT PER KATEGORI (GROUPED) --- */}
            <div className="space-y-6">
                <h3 className="px-4 font-black text-slate-400 uppercase text-xs tracking-[0.2em]">Ringkasan Sumber Cuan</h3>
                {Object.keys(groupedHistory).length > 0 ? (
                    Object.entries(groupedHistory).map(([catName, txs]) => (
                        <div key={catName} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                                <History size={18} className="text-blue-500" />
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">
                                    {catName}
                                </h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {txs.map((tx, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-colors cursor-default">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                                                {tx.description || "Tanpa keterangan"}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {new Date(tx.createdAt).toLocaleDateString("id-ID")}
                                            </span>
                                        </div>
                                        <span className="font-black text-blue-600 text-sm">
                                            +{tx.amount.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 opacity-30 italic text-slate-500">
                        Belum ada riwayat pemasukan...
                    </div>
                )}
            </div>
        </div>
    );
}