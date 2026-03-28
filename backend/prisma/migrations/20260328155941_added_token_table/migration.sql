-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('admin', 'manager', 'employee') NULL;

-- CreateTable
CREATE TABLE `joinToken` (
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `joinToken_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
