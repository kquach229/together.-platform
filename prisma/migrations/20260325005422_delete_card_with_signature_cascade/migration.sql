/*
  Warnings:

  - The values [draft] on the enum `CardStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CardStatus_new" AS ENUM ('collecting', 'delivered', 'archived');
ALTER TYPE "CardStatus" RENAME TO "CardStatus_old";
ALTER TYPE "CardStatus_new" RENAME TO "CardStatus";
DROP TYPE "public"."CardStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_cardId_fkey";

-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "status" SET DEFAULT 'collecting',
ALTER COLUMN "signing_token" SET DEFAULT encode(gen_random_bytes(16), 'hex'),
ALTER COLUMN "delivery_token" SET DEFAULT encode(gen_random_bytes(16), 'hex');

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
