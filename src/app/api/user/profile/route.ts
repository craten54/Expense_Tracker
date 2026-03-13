// src/app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { name, image } = body; // 'name' ini input dari form modal

        // Update user di database
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                username: name, // Kita masukkan variabel 'name' ke kolom 'username'
                image: image    // 'image' tetap sama karena di schema namanya 'image'
            },
        });

        return NextResponse.json({ message: "Profil berhasil diupdate", user: updatedUser });
    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ error: "Gagal update profil" }, { status: 500 });
    }
}