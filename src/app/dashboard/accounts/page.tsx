"use client";
import { ChevronDown, Landmark, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

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
    const [isOpen, setIsOpen] = useState(false);
    
    // State untuk menampung daftar akun yang sudah terdaftar
    const [registeredAccounts, setRegisteredAccounts] = useState([]);

    // Ambil data akun saat halaman dimuat
    useEffect(() => {
        fetchRegisteredAccounts();
    }, []);

    const fetchRegisteredAccounts = async () => {
        const res = await fetch("/api/dashboard/summary");
        const data = await res.json();
        setRegisteredAccounts(data.walletDetails || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const finalName = selectedAccount.id === 'other' ? customName : selectedAccount.name;
        
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
                fetchRegisteredAccounts(); // Refresh list sebelah kanan
                setBalance("");
                setCustomName("");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Hapus akun ${name}? Semua data transaksi akan ikut terhapus.`)) return;

        try {
            const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
            if (res.ok) {
                alert("Akun berhasil dihapus!");
                fetchRegisteredAccounts(); // Refresh list sebelah kanan
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* --- BLOK KIRI: FORM INPUT --- */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold mb-6 text-slate-800">Registrasi Akun Baru</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Dropdown Bank/E-Wallet (Kode kamu yang lama di sini) */}
                        <div className="relative">
                             <label className="block text-sm font-semibold text-slate-600 mb-2">Pilih Bank / E-Wallet</label>
                             <div onClick={() => setIsOpen(!isOpen)} className="w-full p-4 pl-12 pr-10 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer flex items-center justify-between hover:border-blue-500 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="absolute left-4 w-6 h-6 flex items-center justify-center">
                                        {selectedAccount.logo ? <img src={selectedAccount.logo} alt="" className="object-contain" /> : <Landmark className="text-blue-500" size={20} />}
                                    </div>
                                    <span className="font-medium text-slate-700">{selectedAccount.name}</span>
                                </div>
                                <ChevronDown className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
                             </div>
                             {/* Menu Dropdown logic... */}
                        </div>

                        {/* Input Saldo & Tombol Submit (Sesuai kode lama kamu) */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Saldo Awal</label>
                            <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-bold" required />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
                            {loading ? "Mendaftarkan..." : "Daftarkan Akun"}
                        </button>
                    </form>
                </div>

                {/* --- BLOK KANAN: MANAGE / DELETE --- */}
                <div className="bg-slate-50/50 p-8 rounded-3xl border border-dashed border-slate-200">
                    <h2 className="text-xl font-bold mb-6 text-slate-800">Kelola Akun Terdaftar</h2>
                    
                    <div className="space-y-4">
                        {registeredAccounts.length === 0 ? (
                            <p className="text-slate-400 text-center py-10">Belum ada akun terdaftar.</p>
                        ) : (
                            registeredAccounts.map((acc: any) => (
                                <div key={acc.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                            <Landmark className="text-blue-500" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{acc.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black">{acc.type}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(acc.id, acc.name)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}