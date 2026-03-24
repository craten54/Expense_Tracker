import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Await params (Penting untuk Next.js versi terbaru)
        const { id } = await params;
        const walletId = parseInt(id);

        if (isNaN(walletId)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        // 2. Cari user untuk verifikasi kepemilikan
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
        }

        // 3. Gunakan deleteMany agar bisa memverifikasi userId dalam satu query
        // Ini mencegah user A menghapus wallet milik user B via URL
        const deleteResult = await prisma.wallet.deleteMany({
            where: {
                id: walletId,
                userId: user.id,
            },
        });

        if (deleteResult.count === 0) {
            return NextResponse.json({ error: "Akun tidak ditemukan atau bukan milik Anda" }, { status: 404 });
        }

        return NextResponse.json({ message: "Akun berhasil dihapus" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
    }
}