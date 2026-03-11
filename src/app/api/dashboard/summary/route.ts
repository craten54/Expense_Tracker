import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // 1. Cek session dan email (sebagai fallback ID)
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        /** * 2. Ambil userId dengan aman.
         * Jika TS merah di 'session.user.id', kita ambil ID langsung dari DB berdasarkan email.
         * Ini jauh lebih akurat dan mencegah data tertukar jika ada isu session.
         */
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userId = user.id;

        // 3. Agregasi saldo (Hanya milik userId ini)
        const totalBalance = await prisma.wallet.aggregate({
            _sum: { balance: true },
            where: { userId: userId } 
        });

        // 4. Ambil rincian per wallet (opsional, tapi berguna untuk Dashboard)
        const wallets = await prisma.wallet.findMany({
            where: { userId: userId },
            select: { name: true, balance: true, type: true }
        });

        return NextResponse.json({ 
            balance: totalBalance._sum.balance || 0,
            walletDetails: wallets
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return NextResponse.json({ error: "Gagal memuat data saldo" }, { status: 500 });
    }
}