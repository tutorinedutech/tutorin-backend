/*
  Warnings:

  - The primary key for the `class_sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `class_details` DROP FOREIGN KEY `Class_details_class_session_id_fkey`;

-- AlterTable
ALTER TABLE `class_details` MODIFY `class_session_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `class_sessions` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Class_details` ADD CONSTRAINT `Class_details_class_session_id_fkey` FOREIGN KEY (`class_session_id`) REFERENCES `Class_sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
