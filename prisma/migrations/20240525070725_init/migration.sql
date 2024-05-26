/*
  Warnings:

  - Added the required column `profile_picture` to the `Tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tutors` ADD COLUMN `profile_picture` VARCHAR(191) NOT NULL;
