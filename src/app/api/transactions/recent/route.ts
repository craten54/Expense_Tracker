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

        if (!user) return NextResponse.json([], { status: 404 });

        // Ambil transaksi tanpa filter ribet dulu, yang penting muncul
        const transactions = await prisma.transaction.findMany({
            where: { userId: user.id },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true // Pastikan ini true agar nama kategori muncul
            }
        });

        console.log("Data ditemukan untuk user:", user.id, transactions.length);
        return NextResponse.json(transactions);
    } catch (error) {
        console.error("API Recent Error:", error);
        return NextResponse.json([]); // Kembalikan array kosong jika error
    }
}