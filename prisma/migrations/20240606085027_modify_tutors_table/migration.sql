/*
  Warnings:

  - You are about to drop the column `learning_methods` on the `Tutors` table. All the data in the column will be lost.
  - Added the required column `learning_method` to the `Tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tutors` DROP COLUMN `learning_methods`,
    ADD COLUMN `learning_method` VARCHAR(191) NOT NULL;
