-- AlterTable
ALTER TABLE `ResourceItem` ADD COLUMN `allocatedRequestId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `ResourceItem_allocatedRequestId_idx` ON `ResourceItem`(`allocatedRequestId`);

-- AddForeignKey
ALTER TABLE `ResourceItem` ADD CONSTRAINT `ResourceItem_allocatedRequestId_fkey` FOREIGN KEY (`allocatedRequestId`) REFERENCES `request`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
