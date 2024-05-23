/*
  Warnings:

  - You are about to drop the column `education_level` on the `tutors` table. All the data in the column will be lost.
  - Added the required column `educationLevel` to the `Tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tutors` DROP COLUMN `education_level`,
    ADD COLUMN `educationLevel` VARCHAR(191) NOT NULL;
