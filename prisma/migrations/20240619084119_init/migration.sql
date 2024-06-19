/*
  Warnings:

  - You are about to alter the column `days` on the `purchases` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `times` on the `purchases` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `purchases` MODIFY `days` JSON NOT NULL,
    MODIFY `times` JSON NOT NULL;
