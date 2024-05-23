/*
  Warnings:

  - You are about to drop the column `educationLevel` on the `tutors` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `tutors` table. All the data in the column will be lost.
  - Added the required column `education_level` to the `Tutors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tutors` DROP COLUMN `educationLevel`,
    DROP COLUMN `phoneNumber`,
    ADD COLUMN `education_level` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NOT NULL;
