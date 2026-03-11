"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const ACCOUNT_OPTIONS = [
    { id: 'bca', name: 'BCA', type: 'BANK', logo: '/logos/bca.svg' },
    { id: 'mandiri', name: 'Mandiri', type: 'BANK', logo: '/logos/mandiri.svg' },
    { id: 'bni', name: 'BNI', type: 'BANK', logo: '/logos/bni.svg' },
    { id: 'ovo', name: 'OVO', type: 'E-WALLET', logo: '/logos/ovo.svg' },
    { id: 'gopay', name: 'GoPay', type: 'E-WALLET', logo: '/logos/gopay.svg' },
    { id: 'dana', name: 'DANA', type: 'E-WALLET', logo: '/logos/dana.svg' },
    { id: 'shopeepay', name: 'ShopeePay', type: 'E-WALLET', logo: '/logos/shopeepay.svg' }
];

export default function AccountsPage() {
    const [selectedAccount, setSelectedAccount] = useState(ACCOUNT_OPTIONS[0]);
    const [balance, setBalance] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/accounts", {
            method: "POST",
            body: JSON.stringify({
                name: selectedAccount.name,
                type: selectedAccount.type,
                balance: parseFloat(balance)
            }),
        });
        if (res.ok) {
            alert(`Akun ${selectedAccount.name} berhasil ditambahkan!`);
            window.location.href = "/dashboard";
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-10">
            <h2 className="text-xl font-bold mb-6 text-slate-800 text-center">Registrasi Akun Keuangan</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Field Pilih Bank / E-Wallet */}
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Pilih Bank / E-Wallet</label>
                    <div className="relative">
                        {/* Dropdown Select */}
                        <select
                            className="w-full p-4 pl-12 pr-10 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 transition-all cursor-pointer text-slate-700 font-medium"
                            onChange={(e) => {
                                const acc = ACCOUNT_OPTIONS.find(a => a.id === e.target.value);
                                if (acc) setSelectedAccount(acc);
                            }}
                        >
                            {ACCOUNT_OPTIONS.map((acc) => (
                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                            ))}
                        </select>

                        {/* Logo Dinamis (Kiri) */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center pointer-events-none">
                            <img
                                src={selectedAccount.logo}
                                alt={selectedAccount.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>

                        {/* Ikon Panah Dropdown (Kanan) */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown size={20} />
                        </div>
                    </div>
                </div>

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
                    className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all transform active:scale-95"
                >
                    Daftarkan Akun
                </button>
            </form>
        </div>
    );
}