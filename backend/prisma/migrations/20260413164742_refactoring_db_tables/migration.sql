-- CreateTable
CREATE TABLE `user` (
    `username` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'manager', 'employee') NULL,
    `password` VARCHAR(191) NOT NULL,
    `enrolled` BOOLEAN NOT NULL DEFAULT false,
    `companyId` VARCHAR(191) NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,

    UNIQUE INDEX `company_id_key`(`id`),
    UNIQUE INDEX `company_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resource` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `availability` BOOLEAN NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `totalQuantity` INTEGER NOT NULL,
    `availableQuantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `resource_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request` (
    `id` VARCHAR(191) NOT NULL,
    `requestedById` VARCHAR(191) NOT NULL,
    `reviewedById` VARCHAR(191) NOT NULL,
    `requestedQuantity` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `request_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `joinToken` (
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL,

    UNIQUE INDEX `joinToken_token_key`(`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resource` ADD CONSTRAINT `resource_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `request_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `request_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `request_reviewedById_fkey` FOREIGN KEY (`reviewedById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
