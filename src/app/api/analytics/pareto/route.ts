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

        // 1. Ambil pengeluaran per kategori
        const expenses = await prisma.transaction.groupBy({
        by: ['categoryId'],
        where: { userId: user.id, type: 'EXPENSE' },
        _sum: { amount: true },
        });

        // 2. Ambil nama kategorinya
        const categories = await prisma.category.findMany({
        where: { userId: user.id }
        });

        // 3. Gabungkan dan Urutkan dari yang paling boros
        let formattedData = expenses.map(item => {
        const categoryName = categories.find(c => c.id === item.categoryId)?.name || "Lainnya";
        return {
            name: categoryName,
            value: item._sum.amount || 0
        };
        }).sort((a, b) => b.value - a.value);

        // 4. Hitung Kumulatif
        const totalExpense = formattedData.reduce((acc, curr) => acc + curr.value, 0);
        let runningTotal = 0;

        const finalData = formattedData.map(item => {
        runningTotal += item.value;
        return {
            ...item,
            cumulative: totalExpense > 0 ? Math.round((runningTotal / totalExpense) * 100) : 0
        };
        });

        return NextResponse.json(finalData);
    } catch (error) {
        return NextResponse.json({ error: "Gagal memuat analisis" }, { status: 500 });
    }
}