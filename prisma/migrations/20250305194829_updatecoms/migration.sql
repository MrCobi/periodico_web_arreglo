-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `parentId` VARCHAR(191) NULL;
