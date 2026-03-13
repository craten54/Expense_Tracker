import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const year = new Date().getFullYear();

        // 1. Ambil semua transaksi pengeluaran di tahun ini
        const transactions = await prisma.transaction.findMany({
        where: {
            userId: user.id,
            type: 'EXPENSE',
            createdAt: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
            }
        },
        select: { amount: true, createdAt: true }
        });

        // 2. Inisialisasi data 12 bulan
        const monthlyData = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
        ].map(month => ({ month, total: 0 }));

        // 3. Masukkan data transaksi ke bulannya masing-masing
        transactions.forEach(t => {
        const monthIndex = new Date(t.createdAt).getMonth();
        monthlyData[monthIndex].total += t.amount;
        });

        return NextResponse.json(monthlyData);
    } catch (error) {
        return NextResponse.json({ error: "Gagal memuat recap" }, { status: 500 });
    }
}