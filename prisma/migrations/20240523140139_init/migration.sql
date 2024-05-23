/*
  Warnings:

  - You are about to drop the column `phone_number` on the `users` table. All the data in the column will be lost.
  - Added the required column `phone_number` to the `Tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tutors` ADD COLUMN `phone_number` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `phone_number`;
