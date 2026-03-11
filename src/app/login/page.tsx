"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // Import ikon mata
import Link from "next/link";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State untuk toggle mata
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const res = await signIn("credentials", {
            identifier,
            password,
            redirect: false,
        });

        if (res?.ok) {
            router.push("/dashboard");
            router.refresh();
        } else {
            alert("Login Gagal! Cek kembali username/email dan password kamu.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-slate-800 text-center">Login ET-Pareto</h1>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Input Identifier (Email/Username) */}
                    <div>
                        <input
                            type="text"
                            placeholder="Username atau Email"
                            className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onChange={(e) => setIdentifier(e.target.value)} 
                            required
                        />
                    </div>

                    {/* Input Password dengan Toggle Mata */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>

                    <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200 shadow-md">
                        Sign In
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Atau</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="w-full mt-4 flex items-center justify-center gap-3 border border-slate-300 p-3 rounded-lg hover:bg-slate-50 transition text-slate-700 font-medium text-sm shadow-sm"
                    >
                        <img src="https://authjs.dev/img/providers/google.svg" width="18" alt="Google logo" />
                        Sign in with Google
                    </button>
                </div>

                <div className="mt-8 text-center space-y-3">
                    <p className="text-sm text-slate-500">
                        Belum punya akun? {" "}
                        <Link href="/register" className="text-blue-600 font-bold hover:underline">
                            Daftar di sini
                        </Link>
                    </p>
                    <div className="text-center">
                        <Link href="/forgot-password" className="text-slate-400 hover:text-slate-600 text-xs italic transition">
                            Lupa Password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}