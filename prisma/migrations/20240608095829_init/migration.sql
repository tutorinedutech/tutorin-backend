-- CreateTable
CREATE TABLE `Pending_payments` (
    `id` VARCHAR(191) NOT NULL,
    `learner_id` INTEGER NOT NULL,
    `tutor_id` INTEGER NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `sessions` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pending_payments` ADD CONSTRAINT `Pending_payments_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `Learners`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pending_payments` ADD CONSTRAINT `Pending_payments_tutor_id_fkey` FOREIGN KEY (`tutor_id`) REFERENCES `Tutors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
