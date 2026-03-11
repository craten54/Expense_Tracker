import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // Import ini
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

const handler = NextAuth({
    providers: [
        // 1. Provider Google
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        
        // 2. Provider Credentials (Kode lama kamu)
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            identifier: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.identifier || !credentials?.password) return null;

            // Mencari user yang username-nya cocok ATAU email-nya cocok
            const user = await prisma.user.findFirst({
                where: {
                OR: [
                    { username: credentials.identifier },
                    { email: credentials.identifier }
                ]
                }
            });

            if (!user || !user.password) return null;

            // Bandingkan hash
            if (hashPassword(credentials.password) !== user.password) {
                return null;
            }

            return { id: user.id.toString(), name: user.username, email: user.email };
            }
        })
    ],
    
    // Callback ini penting supaya user Google otomatis masuk database Prisma
    callbacks: {
        async signIn({ user, account, profile }) {
        if (account?.provider === "google") {
            // Cek apakah user sudah ada di DB berdasarkan email
            const existingUser = await prisma.user.findUnique({
            where: { email: user.email as string }
            });

            if (!existingUser) {
            // Kalau belum ada, buat user baru otomatis
            await prisma.user.create({
                data: {
                email: user.email,
                username: user.name?.replace(/\s+/g, '').toLowerCase(), // Buat username dari nama
                image: user.image,
                }
            });
            }
        }
        return true;
        },
        async session({ session, token }) {
        return session;
        }
    },

    pages: { signIn: "/login" },
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };