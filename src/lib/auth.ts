// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
// ... import provider lainnya

export const authOptions: NextAuthOptions = { // <--- WAJIB ADA 'export'
    providers: [
        // ... konfigurasi provider kamu
    ],
    callbacks: {
        session: ({ session, token }) => ({
        ...session,
        user: {
            ...session.user,
            id: token.sub, // Ini supaya session punya ID user
        },
        }),
    },
    // ... rest of config
};