import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/mail"; // Import fungsi dari lib

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return NextResponse.json({ error: "Email tidak terdaftar" }, { status: 404 });
        }

        // Panggil fungsi dari lib/mail.ts
        // Token bisa kamu generate pakai crypto atau library lain, 
        // sementara kita kirim string kosong dulu kalau kamu belum buat logic tokennya
        await sendResetPasswordEmail(email, "isi-token-disini"); 

        return NextResponse.json({ message: "Email terkirim!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Gagal kirim email" }, { status: 500 });
    }
}