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
        async signIn({ user, account }) {
            // KHUSUS LOGIN GOOGLE
            if (account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email as string },
                });

                // Kalau user belum ada di Supabase, kita buatin sekarang
                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email,
                            username: user.name, // atau user.email?.split('@')[0]
                            image: user.image,
                        },
                    });
                }
            }
            return true; // Izinkan login lanjut
        },

        async jwt({ token, user, trigger, session }) {
            // Jika ini login pertama kali atau via Google
            if (user) {
                // Cari data asli di DB biar dapet ID Integer-nya
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email as string }
                });

                if (dbUser) {
                    token.id = dbUser.id; // Ini ID Integer dari Supabase
                    token.name = dbUser.username;
                    token.email = dbUser.email;
                    token.picture = dbUser.image;
                }
            }

            if (trigger === "update" && session) {
                token.name = session.name;
                token.picture = session.image;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).name = token.name;
                (session.user as any).email = token.email;
                (session.user as any).image = token.picture;
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