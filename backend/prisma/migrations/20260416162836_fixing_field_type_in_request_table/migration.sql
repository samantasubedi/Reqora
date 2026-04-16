/*
  Warnings:

  - You are about to alter the column `requestedQuantity` on the `request` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `request` MODIFY `requestedQuantity` INTEGER NOT NULL;
