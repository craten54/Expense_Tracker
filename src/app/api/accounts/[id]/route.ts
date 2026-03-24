import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Perhatikan tipe datanya: params sekarang harus Promise
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. WAJIB di-await sesuai pesan error tadi
        const { id } = await context.params;
        const walletId = parseInt(id);

        if (isNaN(walletId)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // 2. Eksekusi hapus
        const deleteResult = await prisma.wallet.deleteMany({
            where: {
                id: walletId,
                userId: user.id,
            },
        });

        if (deleteResult.count === 0) {
            return NextResponse.json({ error: "Akun tidak ditemukan atau bukan milik Anda" }, { status: 404 });
        }

        return NextResponse.json({ message: "Wallet berhasil dihapus" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Gagal menghapus akun" }, { status: 500 });
    }
}