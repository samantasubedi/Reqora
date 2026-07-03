-- AlterTable
ALTER TABLE `resource` ADD COLUMN `inUseQuantity` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `underMaintenanceQuantity` INTEGER NOT NULL DEFAULT 0;
