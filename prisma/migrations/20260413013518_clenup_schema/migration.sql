/*
  Warnings:

  - You are about to drop the column `plan` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CardBalanceEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plan_limits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CardBalanceEvent" DROP CONSTRAINT "CardBalanceEvent_cardId_fkey";

-- DropForeignKey
ALTER TABLE "CardBalanceEvent" DROP CONSTRAINT "CardBalanceEvent_purchaseId_fkey";

-- DropForeignKey
ALTER TABLE "CardBalanceEvent" DROP CONSTRAINT "CardBalanceEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscription" DROP CONSTRAINT "UserSubscription_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "plan";

-- DropTable
DROP TABLE "CardBalanceEvent";

-- DropTable
DROP TABLE "Price";

-- DropTable
DROP TABLE "UserSubscription";

-- DropTable
DROP TABLE "plan_limits";

-- DropEnum
DROP TYPE "BillingInterval";

-- DropEnum
DROP TYPE "CardBalanceEventType";

-- DropEnum
DROP TYPE "Plan";

-- DropEnum
DROP TYPE "SubscriptionStatus";
