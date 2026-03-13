"use client"
import { useState, Suspense } from "react"; // Tambah Suspense
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X } from "lucide-react";

// 1. Buat komponen terpisah untuk formnya
function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const requirements = [
        { re: /.{8,}/, label: "Minimal 8 Karakter" },
        { re: /[A-Z]/, label: "Wajib 1 Huruf Besar" },
        { re: /[0-9]/, label: "Wajib 1 Angka" },
        { re: /^[a-zA-Z0-9.]+$/, label: "Karakter Aman (a-zA-Z0-9.)" },
    ];

    const metCount = requirements.filter(req => req.re.test(password)).length;
    const isAllMet = metCount === requirements.length;
    const isMatch = password === confirm && confirm !== "";

    const handleReset = async (e: any) => {
        e.preventDefault();
        if (!isAllMet) return alert("Password belum memenuhi syarat!");
        if (!isMatch) return alert("Password tidak cocok!");

        const res = await fetch("/api/reset-password-final", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            alert("✅ Password berhasil diganti!");
            router.push("/login");
        }
    };

    return (
        <form onSubmit={handleReset} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Reset Password</h2>
            <p className="text-xs text-slate-500 mb-6 italic">Email: {email}</p>

            <div className="space-y-4">
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="New Password" 
                        className="w-full border border-slate-200 p-3 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>

                {password && (
                    <div className="space-y-2">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-300 ${metCount === 4 ? 'bg-green-500' : metCount >= 2 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${(metCount / 4) * 100}%` }}
                            ></div>
                        </div>
                        <ul className="grid grid-cols-2 gap-1">
                            {requirements.map((req, i) => (
                                <li key={i} className={`flex items-center gap-1 text-[10px] ${req.re.test(password) ? "text-green-600" : "text-slate-400"}`}>
                                    {req.re.test(password) ? <Check size={10} /> : <X size={10} />}
                                    {req.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="space-y-1">
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        className={`w-full border p-3 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            confirm && (isMatch ? 'border-green-500' : 'border-red-500')
                        }`}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                    {confirm && (
                        <p className={`text-[10px] font-bold flex items-center gap-1 transition-all ${
                            isMatch ? "text-green-600" : "text-red-500"
                        }`}>
                            {isMatch ? (
                                <><Check size={12} /> Password sudah sama</>
                            ) : (
                                <><X size={12} /> Password tidak sama, coba cek lagi ya</>
                            )}
                        </p>
                    )}
                </div>

                <button 
                    disabled={!isAllMet || !isMatch} 
                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold disabled:bg-slate-300 transition shadow-md"
                >
                    Update Password
                </button>
            </div>
        </form>
    );
}

// 2. Export utama yang sudah dibungkus Suspense
export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans text-slate-800">
            <Suspense fallback={<div className="text-white">Loading form...</div>}>
                <ResetPasswordContent />
            </Suspense>
        </div>
    );
}