// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) return null;
                
                const user = await prisma.user.findFirst({
                    where: { OR: [{ username: credentials.identifier }, { email: credentials.identifier }] }
                });
                
                if (!user || !user.password) return null;
                if (hashPassword(credentials.password) !== user.password) return null;

                // PASTIKAN IMAGE DISERTAKAN DI SINI
                return {
                    id: user.id.toString(),
                    name: user.username,
                    email: user.email,
                    image: user.image // <-- Tambahkan ini!
                };
            }
        })
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // 1. Saat pertama kali login, masukkan data dari database ke token
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.picture = (user as any).image; // NextAuth pakai field 'picture' di dalam JWT
            }

            // 2. Jika ada update profil (setelah klik Simpan Perubahan), update token-nya
            if (trigger === "update" && session) {
                token.name = session.name;
                token.picture = session.image;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // Ambil data dari token (JWT) dan pindahkan ke session (Frontend)
                (session.user as any).id = token.id;
                (session.user as any).name = token.name;
                (session.user as any).email = token.email;
                (session.user as any).image = token.picture; // Balikin ke 'image' buat Frontend
            }
            return session;
        }
    },

    events: {
        async createUser({ user }) {
            // Logika tambahan jika ingin sinkronisasi awal
            console.log("User baru dibuat:", user.email);
        },
    },
    
    pages: { signIn: "/login" },
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
};