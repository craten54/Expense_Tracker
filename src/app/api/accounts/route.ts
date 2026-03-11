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

        const { name, type, balance } = await req.json();

        const newWallet = await prisma.wallet.create({
        data: {
            name,
            type,
            balance: parseFloat(balance),
            userId: user.id,
        },
        });

        return NextResponse.json(newWallet);
    } catch (error) {
        return NextResponse.json({ error: "Gagal membuat akun" }, { status: 500 });
    }
}