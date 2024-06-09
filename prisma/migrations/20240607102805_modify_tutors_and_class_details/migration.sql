/*
  Warnings:

  - You are about to drop the column `rekening_number` on the `Tutors` table. All the data in the column will be lost.
  - Added the required column `account_number` to the `Tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Class_details` MODIFY `timestamp` DATETIME(3) NULL,
    MODIFY `location` VARCHAR(191) NULL,
    MODIFY `proof_image_link` VARCHAR(191) NULL,
    MODIFY `validation_status` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Tutors` DROP COLUMN `rekening_number`,
    ADD COLUMN `account_number` VARCHAR(191) NOT NULL;
