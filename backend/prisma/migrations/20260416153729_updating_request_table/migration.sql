-- DropForeignKey
ALTER TABLE `request` DROP FOREIGN KEY `request_reviewedById_fkey`;

-- DropIndex
DROP INDEX `request_reviewedById_fkey` ON `request`;

-- AlterTable
ALTER TABLE `request` MODIFY `reviewedById` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `request_reviewedById_fkey` FOREIGN KEY (`reviewedById`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
