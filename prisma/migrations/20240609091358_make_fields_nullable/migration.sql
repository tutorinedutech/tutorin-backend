-- AlterTable
ALTER TABLE `class_details` MODIFY `timestamp` DATETIME(3) NULL,
    MODIFY `location` VARCHAR(191) NULL,
    MODIFY `proof_image_link` VARCHAR(191) NULL,
    MODIFY `validation_status` VARCHAR(191) NULL;
