/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `joinToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `joinToken_email_key` ON `joinToken`;

-- CreateIndex
CREATE UNIQUE INDEX `joinToken_token_key` ON `joinToken`(`token`);
