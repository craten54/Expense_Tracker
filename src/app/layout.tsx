"use client"
import "./globals.css";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-white border-b border-slate-200 px-10 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="font-bold text-xl text-blue-600 tracking-tighter">ET-Pareto 📈</Link>
        <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600">Home</Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600">Dashboard</Link>
            
            {session ? (
            <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
            >
                Logout ({session.user?.name})
            </button>
            ) : (
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                Login
            </Link>
            )}
        </div>
        </nav>
    );
    }

    export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id">
        <body className="antialiased">
            <SessionProvider>
            <Navbar />
            {children}
            </SessionProvider>
        </body>
        </html>
    );
    }