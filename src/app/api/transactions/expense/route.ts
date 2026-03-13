import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const { amount, description, walletId, categoryName } = await req.json();

        // Database Transaction: Pastikan saldo berkurang DAN transaksi tercatat
        const result = await prisma.$transaction(async (tx) => {
        // 1. Update Saldo Wallet (Decrement)
        await tx.wallet.update({
            where: { id: parseInt(walletId) },
            data: { balance: { decrement: parseFloat(amount) } },
        });

        // 2. Buat/Cari Kategori
        const category = await tx.category.upsert({
            where: { name_userId: { name: categoryName, userId: user.id } },
            update: {},
            create: { name: categoryName, userId: user.id },
        });

        // 3. Simpan Transaksi
        return await tx.transaction.create({
            data: {
            amount: parseFloat(amount),
            type: "EXPENSE",
            description,
            userId: user.id,
            walletId: parseInt(walletId),
            categoryId: category.id,
            },
        });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Gagal mencatat pengeluaran" }, { status: 500 });
  }
}