/*
  Warnings:

  - Made the column `sessions` on table `class_sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject` on table `class_sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject` on table `payment_transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sessions` on table `payment_transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `payment_transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `class_sessions` MODIFY `sessions` INTEGER NOT NULL,
    MODIFY `subject` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `payment_transactions` MODIFY `subject` VARCHAR(191) NOT NULL,
    MODIFY `sessions` INTEGER NOT NULL,
    MODIFY `price` DOUBLE NOT NULL;
