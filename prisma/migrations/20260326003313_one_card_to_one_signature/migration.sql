/*
  Warnings:

  - A unique constraint covering the columns `[cardId,userId]` on the table `Signature` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "signing_token" SET DEFAULT encode(gen_random_bytes(16), 'hex'),
ALTER COLUMN "delivery_token" SET DEFAULT encode(gen_random_bytes(16), 'hex');

-- CreateIndex
CREATE UNIQUE INDEX "Signature_cardId_userId_key" ON "Signature"("cardId", "userId");
