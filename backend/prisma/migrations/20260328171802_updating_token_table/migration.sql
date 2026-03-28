/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `joinToken` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `joinToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `joinToken` DROP COLUMN `expiryDate`,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;
