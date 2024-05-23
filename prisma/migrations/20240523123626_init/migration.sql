/*
  Warnings:

  - You are about to drop the column `phone_number` on the `tutors` table. All the data in the column will be lost.
  - Added the required column `email` to the `Tutors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Tutors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tutors` DROP COLUMN `phone_number`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;
