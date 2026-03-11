import { NextResponse } from "next/server"; // Biar NextResponse ketemu
import { prisma } from "@/lib/prisma";        // Biar prisma ketemu
import { hashPassword } from "@/lib/hash";    // Biar hashPassword ketemu

export async function POST(req: Request) {
    try {
        const { username, email, password, confirmPassword } = await req.json();

        // 1. Validasi kecocokan password
        if (password !== confirmPassword) {
        return NextResponse.json({ error: "Password tidak cocok!" }, { status: 400 });
        }

        // 2. Validasi panjang password (minimal 8 karakter sesuai request kamu)
        if (password.length < 8) {
        return NextResponse.json({ error: "Password minimal 8 karakter!" }, { status: 400 });
        }

        // 3. Cek apakah username atau email sudah ada
        const userExists = await prisma.user.findFirst({
        where: { OR: [{ username }, { email }] }
        });

        if (userExists) {
        return NextResponse.json({ error: "Username atau Email sudah terdaftar" }, { status: 400 });
        }

        // 4. Simpan ke DB
        await prisma.user.create({
        data: {
            username,
            email,
            password: hashPassword(password),
        },
        });

        return NextResponse.json({ message: "Registrasi berhasil!" });
    } catch (error) {
        return NextResponse.json({ error: "Gagal registrasi" }, { status: 500 });
    }
}