"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X } from "lucide-react"; 
import Link from "next/link";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // --- Logika Syarat Password ---
    const requirements = [
        { re: /.{8,}/, label: "Minimal 8 Karakter" },
        { re: /[A-Z]/, label: "Wajib ada minimal 1 Huruf Besar" },
        { re: /[0-9]/, label: "Wajib ada minimal 1 Angka" },
        { re: /^[a-zA-Z0-9.]+$/, label: "Karakter Aman (a-zA-Z0-9.)" },
    ];

    const metRequirements = requirements.filter(req => req.re.test(password)).length;
    
    const getStrength = () => {
        if (password.length === 0) return { label: "", color: "bg-slate-200", text: "" };
        if (metRequirements <= 1) return { label: "Bad", color: "bg-red-500", text: "text-red-500" };
        if (metRequirements <= 3) return { label: "Normal", color: "bg-yellow-500", text: "text-yellow-500" };
        return { label: "Good", color: "bg-green-500", text: "text-green-500" };
    };

    const strength = getStrength();
    const isAllMet = metRequirements === requirements.length;
    const isMatch = password === confirmPassword && confirmPassword !== "";

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAllMet || !isMatch) return;

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (res.ok) {
            alert("Akun berhasil dibuat!");
            router.push("/login");
        } else {
            const data = await res.json();
            setError(data.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans text-slate-800">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Daftar Akun Baru</h1>

                {error && <p className="bg-red-50 text-red-500 p-2 rounded text-xs mb-4 border border-red-100">{error}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" placeholder="Username" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setUsername(e.target.value)} required />
                    <input type="email" placeholder="Email" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setEmail(e.target.value)} required />

                    {/* Kotak Password dengan Ikon Mata */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-12"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>

                    {/* Password Strength Meter */}
                    {password && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className={strength.text}>Strength: {strength.label}</span>
                                <span className="text-slate-400">{metRequirements}/4 Syarat</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-300 ${strength.color}`} 
                                    style={{ width: `${(metRequirements / 4) * 100}%` }}
                                ></div>
                            </div>
                            
                            <ul className="grid grid-cols-2 gap-1 mt-2">
                                {requirements.map((req, i) => (
                                    <li key={i} className={`flex items-center gap-1 text-[10px] ${req.re.test(password) ? "text-green-600" : "text-slate-400"}`}>
                                        {req.re.test(password) ? <Check size={10} /> : <X size={10} />}
                                        {req.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Confirm Password dengan Feedback Teks */}
                    <div className="space-y-1">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                                confirmPassword && (isMatch ? 'border-green-500' : 'border-red-500')
                            }`}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {confirmPassword && (
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
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}