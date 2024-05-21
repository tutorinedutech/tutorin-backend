/*
  Warnings:

  - You are about to drop the column `sent_at` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Reviews` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Reviews` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_date` on the `Transactions_in` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_date` on the `Transactions_out` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Balances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `Transactions_in` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `Transactions_out` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Balances` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Messages` DROP COLUMN `sent_at`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Reviews` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Transactions_in` DROP COLUMN `transaction_date`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Transactions_out` DROP COLUMN `transaction_date`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL;
