/*
  Warnings:

  - Added the required column `resourceId` to the `request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `request` ADD COLUMN `resourceId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `request_resourceId_fkey` FOREIGN KEY (`resourceId`) REFERENCES `resource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
