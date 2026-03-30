/*
  Warnings:

  - You are about to drop the `prices` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "signing_token" SET DEFAULT encode(gen_random_bytes(16), 'hex'),
ALTER COLUMN "delivery_token" SET DEFAULT encode(gen_random_bytes(16), 'hex');

-- AlterTable
ALTER TABLE "plan_limits" ADD COLUMN     "analyticsDashboard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cardStorageHours" INTEGER;

-- DropTable
DROP TABLE "prices";

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "billingInterval" "BillingInterval" NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Price_stripePriceId_key" ON "Price"("stripePriceId");
