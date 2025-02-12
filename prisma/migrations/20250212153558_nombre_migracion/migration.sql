/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `VerificationToken_identifier_token_key` ON `VerificationToken`;

-- AlterTable
ALTER TABLE `VerificationToken` ADD PRIMARY KEY (`identifier`);

-- CreateTable
CREATE TABLE `Article` (
    `id` VARCHAR(191) NOT NULL,
    `sourceId` VARCHAR(191) NULL,
    `sourceName` VARCHAR(191) NULL,
    `author` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `urlToImage` VARCHAR(191) NULL,
    `publishedAt` DATETIME(3) NOT NULL,
    `content` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Article_url_key`(`url`),
    INDEX `Article_sourceId_idx`(`sourceId`),
    INDEX `Article_publishedAt_idx`(`publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `VerificationToken_identifier_key` ON `VerificationToken`(`identifier`);
