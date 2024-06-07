/*
  Warnings:

  - You are about to drop the column `fraud_status` on the `payment_transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payment_transactions` DROP COLUMN `fraud_status`;
