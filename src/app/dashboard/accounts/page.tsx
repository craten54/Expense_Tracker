"use client";
import { ChevronDown, Landmark } from "lucide-react";
import { useState } from "react";

const ACCOUNT_OPTIONS = [
    { id: 'bca', name: 'BCA', type: 'BANK', logo: '/logos/bca.svg' },
    { id: 'mandiri', name: 'Mandiri', type: 'BANK', logo: '/logos/mandiri.svg' },
    { id: 'bni', name: 'BNI', type: 'BANK', logo: '/logos/bni.svg' },
    { id: 'ovo', name: 'OVO', type: 'E-WALLET', logo: '/logos/ovo.svg' },
    { id: 'gopay', name: 'GoPay', type: 'E-WALLET', logo: '/logos/gopay.svg' },
    { id: 'dana', name: 'DANA', type: 'E-WALLET', logo: '/logos/dana.svg' },
    { id: 'shopeepay', name: 'ShopeePay', type: 'E-WALLET', logo: '/logos/shopeepay.svg' },
    { id: 'other', name: 'Lainnya (Input Manual)', type: 'BANK', logo: '' }
];

export default function AccountsPage() {
    const [selectedAccount, setSelectedAccount] = useState(ACCOUNT_OPTIONS[0]);
    const [balance, setBalance] = useState("");
    const [customName, setCustomName] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // State untuk buka/tutup dropdown

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const finalName = selectedAccount.id === 'other' ? customName : selectedAccount.name;

        if (!finalName) {
            alert("Harap masukkan nama instansi!");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/accounts", {
                method: "POST",
                body: JSON.stringify({
                    name: finalName,
                    type: selectedAccount.type,
                    balance: parseFloat(balance)
                }),
            });

            if (res.ok) {
                alert(`Akun ${finalName} berhasil ditambahkan!`);
                window.location.href = "/dashboard";
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mt-10">
            <h2 className="text-xl font-bold mb-6 text-slate-800 text-center">Registrasi Akun Keuangan</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Custom Dropdown Pilih Bank / E-Wallet */}
                <div className="relative">
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Pilih Bank / E-Wallet</label>
                    
                    {/* Header Dropdown (Yang diklik) */}
                    <div 
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full p-4 pl-12 pr-10 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer flex items-center justify-between hover:border-blue-500 transition-all shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="absolute left-4 w-6 h-6 flex items-center justify-center">
                                {selectedAccount.logo ? (
                                    <img src={selectedAccount.logo} alt="" className="object-contain" />
                                ) : (
                                    <Landmark className="text-blue-500" size={20} />
                                )}
                            </div>
                            <span className="font-medium text-slate-700">{selectedAccount.name}</span>
                        </div>
                        <ChevronDown className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
                    </div>

                    {/* Menu Pilihan (Dropdown List) */}
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                            {ACCOUNT_OPTIONS.map((acc) => (
                                <div
                                    key={acc.id}
                                    className="flex items-center gap-4 p-4 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-none"
                                    onClick={() => {
                                        setSelectedAccount(acc);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        {acc.logo ? (
                                            <img src={acc.logo} alt="" className="object-contain" />
                                        ) : (
                                            <Landmark className="text-blue-500" size={20} />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{acc.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input Nama Manual */}
                {selectedAccount.id === 'other' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-semibold text-blue-600 mb-2">Nama Instansi / Dompet</label>
                        <input
                            type="text"
                            placeholder="Contoh: Bank Jago, LinkAja, atau Kas Fisik"
                            className="w-full p-4 border border-blue-100 rounded-xl bg-blue-50/30 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                            onChange={(e) => setCustomName(e.target.value)}
                            required
                        />
                    </div>
                )}

                {/* Input Saldo */}
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Saldo Awal</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                        <input
                            type="number"
                            placeholder="0"
                            className="w-full p-4 pl-12 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg text-slate-700"
                            onChange={(e) => setBalance(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? "Mendaftarkan..." : "Daftarkan Akun"}
                </button>
            </form>

            {/* Backdrop untuk menutup dropdown saat klik di luar */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
}