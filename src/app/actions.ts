"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function transferGaji() {
    // Kita hardcode dulu buat tes: Kirim 1jt dari Bank ke Gopay
    await prisma.$transaction([
        prisma.wallet.update({
        where: { id: 1 }, // ID Bank BCA kamu
        data: { balance: { decrement: 1000000 } }
        }),
        prisma.wallet.update({
        where: { id: 2 }, // ID Gopay kamu
        data: { balance: { increment: 1000000 } }
        })
    ])
    
    // Refresh data di layar tanpa reload browser
    revalidatePath("/")
}