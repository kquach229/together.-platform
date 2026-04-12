-- CreateEnum
CREATE TYPE "CardBalanceEventType" AS ENUM ('purchased', 'used', 'refunded', 'granted');

-- CreateEnum
CREATE TYPE "CardPackSize" AS ENUM ('pack_1', 'pack_5', 'pack_10');

-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "signing_token" SET DEFAULT encode(gen_random_bytes(16), 'hex'),
ALTER COLUMN "delivery_token" SET DEFAULT encode(gen_random_bytes(16), 'hex');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cardsRemaining" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CardBalanceEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CardBalanceEventType" NOT NULL,
    "delta" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchaseId" TEXT,
    "cardId" TEXT,

    CONSTRAINT "CardBalanceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packSize" "CardPackSize" NOT NULL,
    "cardsAdded" INTEGER NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "stripePaymentIntentId" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardPackPrice" (
    "id" TEXT NOT NULL,
    "packSize" "CardPackSize" NOT NULL,
    "cardsIncluded" INTEGER NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "stripePriceId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardPackPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardPurchase_stripePaymentIntentId_key" ON "CardPurchase"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "CardPurchase_stripeSessionId_key" ON "CardPurchase"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "CardPackPrice_stripePriceId_key" ON "CardPackPrice"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "CardPackPrice_packSize_currency_key" ON "CardPackPrice"("packSize", "currency");

-- AddForeignKey
ALTER TABLE "CardBalanceEvent" ADD CONSTRAINT "CardBalanceEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBalanceEvent" ADD CONSTRAINT "CardBalanceEvent_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBalanceEvent" ADD CONSTRAINT "CardBalanceEvent_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "CardPurchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardPurchase" ADD CONSTRAINT "CardPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
