/*
  Warnings:

  - The values [archived] on the enum `CardStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CardStatus_new" AS ENUM ('collecting', 'delivered');
ALTER TYPE "CardStatus" RENAME TO "CardStatus_old";
ALTER TYPE "CardStatus_new" RENAME TO "CardStatus";
DROP TYPE "public"."CardStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "signing_token" SET DEFAULT encode(gen_random_bytes(16), 'hex'),
ALTER COLUMN "delivery_token" SET DEFAULT encode(gen_random_bytes(16), 'hex');
