/*
  Warnings:

  - Added the required column `companyId` to the `joinToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiryDate` to the `joinToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `used` to the `joinToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `joinToken` ADD COLUMN `companyId` VARCHAR(191) NOT NULL,
    ADD COLUMN `expiryDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `used` BOOLEAN NOT NULL;
