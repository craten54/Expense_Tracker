import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    // Ambil token dari session
    const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET 
    });
    
    const { pathname } = req.nextUrl;

    // LOGIKA 1: ANTI-BALIK KE LANDING PAGE
    // Jika sudah login, jangan biarkan akses halaman login/register/landing
    const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/register";
    
    if (token && isAuthPage) {
        // Pindahkan paksa ke dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // LOGIKA 2: PROTEKSI DASHBOARD
    // Jika belum login dan coba akses area dashboard
    if (!token && pathname.startsWith("/dashboard")) {
        // Pindahkan ke login
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// MATCHER: Menentukan halaman mana yang diawasi
export const config = {
    matcher: [
        /*
         * Cocokkan semua request path kecuali yang dimulai dengan:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - logos (folder logo kamu)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|logos).*)",
    ],
};