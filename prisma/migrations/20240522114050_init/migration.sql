/*
  Warnings:

  - You are about to drop the column `rekeing_number` on the `tutors` table. All the data in the column will be lost.
  - Added the required column `rekening_number` to the `Tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tutors` DROP COLUMN `rekeing_number`,
    ADD COLUMN `rekening_number` VARCHAR(191) NOT NULL;
