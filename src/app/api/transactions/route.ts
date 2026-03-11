import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Ambil session dengan authOptions yang sudah di-export
        const session = await getServerSession(authOptions);

        // 2. Validasi session dan ID user
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 3. Ambil User ID. 
        // Tips: Kalau TS masih merah di 'id', gunakan casting (session.user as any).id
        // Tapi cara paling aman adalah mencari user berdasarkan email dari session
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userId = user.id;

        // 4. Query wallet yang HANYA milik userId ini (Isolasi Data)
        const wallets = await prisma.wallet.findMany({
            where: { userId: userId }
        });

        // 5. Hitung total saldo
        const totalBalance = wallets.reduce((acc, curr) => acc + curr.balance, 0);

        return NextResponse.json({ 
            totalBalance,
            walletCount: wallets.length 
        });

    } catch (error) {
        console.error("Dashboard Summary Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}