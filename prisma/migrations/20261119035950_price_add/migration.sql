/*
  Warnings:

  - The values [pack_3] on the enum `CardPackSize` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CardPackSize_new" AS ENUM ('pack_21', 'pack_1', 'pack_5', 'pack_10');
ALTER TABLE "CardPurchase" ALTER COLUMN "packSize" TYPE "CardPackSize_new" USING ("packSize"::text::"CardPackSize_new");
ALTER TABLE "CardPackPrice" ALTER COLUMN "packSize" TYPE "CardPackSize_new" USING ("packSize"::text::"CardPackSize_new");
ALTER TYPE "CardPackSize" RENAME TO "CardPackSize_old";
ALTER TYPE "CardPackSize_new" RENAME TO "CardPackSize";
DROP TYPE "public"."CardPackSize_old";
COMMIT;
