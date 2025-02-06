/*
  Warnings:

  - You are about to drop the column `contraseña_hash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_registro` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_usuario` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `nombre_usuario` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `contraseña_hash`,
    DROP COLUMN `fecha_registro`,
    DROP COLUMN `nombre_usuario`,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `correo_electronico` TO `User_email_key`;
