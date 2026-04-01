/*
  Warnings:

  - Made the column `lifetimeCardsCreated` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "signing_token" SET DEFAULT encode(gen_random_bytes(16), 'hex'),
ALTER COLUMN "delivery_token" SET DEFAULT encode(gen_random_bytes(16), 'hex');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lifetimeCardsCreated" SET NOT NULL,
ALTER COLUMN "lifetimeCardsCreated" SET DEFAULT 0;
