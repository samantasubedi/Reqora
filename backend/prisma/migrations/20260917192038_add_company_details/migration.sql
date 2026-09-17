-- AlterTable
ALTER TABLE `Company` ADD COLUMN `industry` ENUM('technology', 'finance', 'healthcare', 'education', 'retail', 'manufacturing', 'construction', 'hospitality', 'legal', 'other') NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;
