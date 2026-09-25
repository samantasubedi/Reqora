-- AlterTable
ALTER TABLE `request` MODIFY `status` ENUM('pending', 'approved', 'rejected', 'cancelled', 'forwarded') NOT NULL;
