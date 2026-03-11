import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash"; // Pastikan fungsi SHA-256 kamu ada di sini
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (password.length < 8) {
        return NextResponse.json({ error: "Password minimal 8 karakter!" }, { status: 400 });
        }

        await prisma.user.update({
        where: { email: email },
        data: { password: hashPassword(password) }, // Update password baru yang sudah di-hash
        });

        return NextResponse.json({ message: "Password berhasil diperbarui!" });
    } catch (error) {
        return NextResponse.json({ error: "Gagal update password" }, { status: 500 });
    }
}