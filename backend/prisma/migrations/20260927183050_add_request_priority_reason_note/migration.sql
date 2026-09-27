-- AlterTable
ALTER TABLE `request` ADD COLUMN `note` TEXT NULL,
    ADD COLUMN `priority` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    ADD COLUMN `reason` TEXT NULL;
