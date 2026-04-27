/*
  Warnings:

  - Added the required column `role` to the `joinToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `joinToken` ADD COLUMN `role` ENUM('admin', 'manager', 'employee') NOT NULL;

-- CreateTable
CREATE TABLE `joinCode` (
    `code` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'manager', 'employee') NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL,

    UNIQUE INDEX `joinCode_code_key`(`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
