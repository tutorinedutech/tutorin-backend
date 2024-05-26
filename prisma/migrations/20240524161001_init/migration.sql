/*
  Warnings:

  - Added the required column `ktp` to the `Tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tutors` ADD COLUMN `ktp` VARCHAR(191) NOT NULL;
