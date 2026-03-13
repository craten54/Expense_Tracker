import nodemailer from "nodemailer";

// 1. Inisialisasi Transporter (Mesin Pengirim)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    },
});

// 2. Fungsi Utama buat kirim Reset Password
export const sendResetPasswordEmail = async (email: string, token: string) => {
  // Gunakan NEXTAUTH_URL dari .env agar dinamis (localhost atau production)
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    const mailOptions = {
    from: `"CashMap Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Password Akun CashMap",
    html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #1e293b; text-align: center;">CashMap</h2>
        <p style="color: #475569;">Halo!</p>
        <p style="color: #475569;">Kami menerima permintaan untuk meriset password akun kamu. Jika benar, silakan klik tombol di bawah:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password Sekarang</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">Link ini akan kedaluwarsa dalam 1 jam. Jika kamu tidak merasa meminta ini, abaikan saja email ini.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 10px; text-align: center;">&copy; ${new Date().getFullYear()} CashMap App System.</p>
        </div>
    `,
    };

    return await transporter.sendMail(mailOptions);
};

// 3. (Bonus) Fungsi buat Welcome Email (Bisa kamu pakai nanti pas Register)
export const sendWelcomeEmail = async (email: string, name: string) => {
    const mailOptions = {
        from: `"CashMap" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Selamat Datang di CashMap! 💸",
        html: `<h1>Selamat Datang ${name}!</h1><p>Mulai kelola keuanganmu sekarang.</p>`,
    };
    return await transporter.sendMail(mailOptions);
};