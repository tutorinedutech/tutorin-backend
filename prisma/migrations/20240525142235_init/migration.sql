/*
  Warnings:

  - Added the required column `cv` to the `Tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tutors` ADD COLUMN `cv` VARCHAR(191) NOT NULL;
