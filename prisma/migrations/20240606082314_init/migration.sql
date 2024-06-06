-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    UNIQUE INDEX `Users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blacklist_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Blacklist_token_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Learners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `education_level` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `domicile` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tutors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `education_level` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `domicile` VARCHAR(191) NOT NULL,
    `languages` VARCHAR(191) NOT NULL,
    `teaching_approach` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `rekening_number` VARCHAR(191) NOT NULL,
    `learning_methods` VARCHAR(191) NOT NULL,
    `ktp` VARCHAR(191) NOT NULL,
    `profile_picture` VARCHAR(191) NULL,
    `cv` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Availabilities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_id` INTEGER NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Class_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `learner_id` INTEGER NOT NULL,
    `tutor_id` INTEGER NOT NULL,
    `sessions` INTEGER NOT NULL,
    `subject` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Class_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_session_id` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `proof_image_link` VARCHAR(191) NOT NULL,
    `validation_status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `learner_id` INTEGER NOT NULL,
    `tutor_id` INTEGER NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `sessions` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `amount` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Balances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_id` INTEGER NOT NULL,
    `total` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Withdrawal_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `balance_id` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `tutorsId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sender_id` INTEGER NOT NULL,
    `receiver_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `learner_id` INTEGER NOT NULL,
    `tutor_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Learners` ADD CONSTRAINT `Learners_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tutors` ADD CONSTRAINT `Tutors_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Availabilities` ADD CONSTRAINT `Availabilities_tutor_id_fkey` FOREIGN KEY (`tutor_id`) REFERENCES `Tutors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Class_sessions` ADD CONSTRAINT `Class_sessions_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `Learners`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Class_sessions` ADD CONSTRAINT `Class_sessions_tutor_id_fkey` FOREIGN KEY (`tutor_id`) REFERENCES `Tutors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Class_details` ADD CONSTRAINT `Class_details_class_session_id_fkey` FOREIGN KEY (`class_session_id`) REFERENCES `Class_sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment_transactions` ADD CONSTRAINT `Payment_transactions_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `Learners`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment_transactions` ADD CONSTRAINT `Payment_transactions_tutor_id_fkey` FOREIGN KEY (`tutor_id`) REFERENCES `Tutors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Balances` ADD CONSTRAINT `Balances_tutor_id_fkey` FOREIGN KEY (`tutor_id`) REFERENCES `Tutors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Withdrawal_transactions` ADD CONSTRAINT `Withdrawal_transactions_balance_id_fkey` FOREIGN KEY (`balance_id`) REFERENCES `Balances`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Withdrawal_transactions` ADD CONSTRAINT `Withdrawal_transactions_tutorsId_fkey` FOREIGN KEY (`tutorsId`) REFERENCES `Tutors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `Learners`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_tutor_id_fkey` FOREIGN KEY (`tutor_id`) REFERENCES `Tutors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
