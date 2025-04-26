/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "name" TEXT NOT NULL,
    "initAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL,
    "visibleCategory" TEXT,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "repeat" TEXT NOT NULL DEFAULT 'None',
    "note" TEXT,
    "picture" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "repeat" TEXT NOT NULL DEFAULT 'None',

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "billingDate" TEXT NOT NULL,
    "repeat" TEXT NOT NULL,
    "reminderBefore" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_name_key" ON "Wallet"("name");

-- CreateIndex
CREATE INDEX "idx_transaction_wallet" ON "Transaction"("walletId");

-- CreateIndex
CREATE INDEX "idx_transaction_category" ON "Transaction"("categoryId");

-- CreateIndex
CREATE INDEX "idx_transaction_date" ON "Transaction"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_name_key" ON "Budget"("name");

-- CreateIndex
CREATE INDEX "idx_budget_wallet" ON "Budget"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_name_key" ON "Subscription"("name");

-- CreateIndex
CREATE INDEX "idx_subscription_category" ON "Subscription"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_name_key" ON "UserProfile"("name");

-- CreateIndex
CREATE INDEX "idx_user_name" ON "UserProfile"("name");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_visibleCategory_fkey" FOREIGN KEY ("visibleCategory") REFERENCES "Category"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
