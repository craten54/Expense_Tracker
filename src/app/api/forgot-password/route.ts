import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma"; // Import prisma jangan lupa

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // 1. Cari user di database berdasarkan email
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        // 2. Cek apakah user ada
        if (!user) {
            return NextResponse.json({ error: "Email tidak terdaftar" }, { status: 404 });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `http://localhost:3000/reset-password?email=${email}`;

        await transporter.sendMail({
            from: '"ET-Pareto" <noreply@etpareto.com>',
            to: email,
            subject: "Reset Password Akun ET-Pareto",
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Halo, ${user.username}!</h2>
                    <p>Kamu meminta reset password untuk akun <b>ET-Pareto</b> kamu. Klik tombol di bawah untuk lanjut:</p>
                    <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Reset Password</a>
                    <p style="margin-top: 20px; font-size: 12px; color: gray;">Kalau kamu tidak merasa meminta ini, abaikan saja ya. Keamanan akunmu adalah prioritas kami.</p>
                </div>
            `,
        });

        return NextResponse.json({ message: "Email terkirim!" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Gagal kirim email" }, { status: 500 });
    }
}