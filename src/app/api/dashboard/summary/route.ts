import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userId = user.id;

        // Ambil rincian per wallet (WAJIB SERTAKAN ID)
        const wallets = await prisma.wallet.findMany({
            where: { userId: userId },
            select: { 
                id: true,      // <-- TAMBAHKAN INI (Crucial buat dropdown)
                name: true, 
                balance: true, 
                type: true 
            }
        });

        // Hitung total saldo secara manual agar formatnya angka bersih
        const totalAmount = wallets.reduce((acc, curr) => acc + curr.balance, 0);

        return NextResponse.json({
            balance: totalAmount,    // Return angka bersih (misal: 1000000)
            walletDetails: wallets   // Return array wallet lengkap dengan ID
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
    }
}