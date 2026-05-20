/*
  Warnings:

  - Added the required column `type` to the `resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `joinCode` MODIFY `used` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `joinToken` MODIFY `used` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `resource` ADD COLUMN `type` VARCHAR(191) NOT NULL;
