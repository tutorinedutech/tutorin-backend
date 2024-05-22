/*
  Warnings:

  - Added the required column `phone_number` to the `Students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availability` to the `Tutors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Tutors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rekeing_number` to the `Tutors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studied_method` to the `Tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `students` ADD COLUMN `phone_number` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tutors` ADD COLUMN `availability` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `rekeing_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `studied_method` VARCHAR(191) NOT NULL;
