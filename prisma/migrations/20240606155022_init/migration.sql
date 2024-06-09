/*
  Warnings:

  - Added the required column `fraud_status` to the `Payment_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment_transactions` ADD COLUMN `fraud_status` VARCHAR(191) NOT NULL;
