import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CashMap",
    icons: {
    icon: "/logos/cashmap_logo.png", // Arahkan ke lokasi logo kamu di folder public
    },
    };

    export default function RootLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <html lang="id">
        <body className={`${inter.className} antialiased`}>
            <AuthProvider>
            {/* Navbar sudah dihapus dari sini agar tidak "bocor" ke Dashboard */}
            {children}
            </AuthProvider>
        </body>
        </html>
    );
}