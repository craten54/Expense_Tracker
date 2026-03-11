-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "toWalletId" INTEGER;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "type" SET DEFAULT 'CASH';

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toWalletId_fkey" FOREIGN KEY ("toWalletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
