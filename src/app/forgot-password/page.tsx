"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false); // State untuk loading

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Mulai loading

        try {
        const res = await fetch("/api/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("✅ Berhasil! Silakan cek email kamu (termasuk folder spam).");
        } else {
            alert("❌ Error: " + (data.error || "Terjadi kesalahan"));
        }
        } catch (error) {
        alert("❌ Gagal menyambung ke server.");
        } finally {
        setIsLoading(false); // Matikan loading
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
            <h1 className="text-xl font-bold mb-4 text-slate-800">Lupa Password?</h1>
            <p className="text-sm text-slate-500 mb-6">Masukkan email untuk menerima link reset.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
            <input 
                type="email" 
                placeholder="email@contoh.com" 
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button 
                disabled={isLoading}
                className={`w-full p-3 rounded-lg font-bold text-white transition ${isLoading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isLoading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
            </form>
            
            <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-blue-600 hover:underline">Kembali ke Login</Link>
            </div>
        </div>
        </main>
    );
}