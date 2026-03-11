import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Bersihkan data lama (opsional, supaya nggak double)
    await prisma.transaction.deleteMany()
    await prisma.wallet.deleteMany()
    await prisma.user.deleteMany()

  // 2. Buat User Contoh
    const user = await prisma.user.create({
        data: {
            username: 'client_demo',
            password: 'password123', // Dummy password
        },
    })

  // 3. Buat Dompet (Contoh Gajian)
    const bank = await prisma.wallet.create({
    data: { name: 'Bank BCA (Gaji)', type: 'BANK', balance: 5000000, userId: user.id }
    })
    const gopay = await prisma.wallet.create({
    data: { name: 'Gopay', type: 'E-WALLET', balance: 0, userId: user.id }
    })

  // 4. Buat Contoh Transaksi (Buat ngetes Pareto nanti)
    await prisma.transaction.createMany({
        data: [
            { amount: 1500000, type: 'EXPENSE', description: 'Bayar Kost', userId: user.id, walletId: bank.id },
            { amount: 500000, type: 'EXPENSE', description: 'Belanja Bulanan', userId: user.id, walletId: bank.id },
            { amount: 200000, type: 'EXPENSE', description: 'Top Up Game', userId: user.id, walletId: bank.id },
        ]
    })

    console.log("✅ Database berhasil diisi data contoh!")
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })