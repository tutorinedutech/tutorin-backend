/*
  Warnings:

  - You are about to drop the column `phone_number` on the `tutors` table. All the data in the column will be lost.
  - Added the required column `phone_number` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tutors` DROP COLUMN `phone_number`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `phone_number` VARCHAR(191) NOT NULL;
