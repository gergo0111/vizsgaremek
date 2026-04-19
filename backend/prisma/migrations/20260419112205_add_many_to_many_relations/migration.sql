/*
  Warnings:

  - You are about to drop the column `eszkoz_id` on the `munka` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `munka` table. All the data in the column will be lost.
  - Added the required column `leiras` to the `munka` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `munka` DROP FOREIGN KEY `munka_eszkoz_id_fkey`;

-- DropForeignKey
ALTER TABLE `munka` DROP FOREIGN KEY `munka_user_id_fkey`;

-- DropIndex
DROP INDEX `munka_eszkoz_id_fkey` ON `munka`;

-- DropIndex
DROP INDEX `munka_user_id_fkey` ON `munka`;

-- AlterTable
ALTER TABLE `munka` DROP COLUMN `eszkoz_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `leiras` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `isActive` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `munka_user` (
    `munka_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `munka_user_user_id_idx`(`user_id`),
    PRIMARY KEY (`munka_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `munka_eszkoz` (
    `munka_id` INTEGER NOT NULL,
    `eszkoz_id` INTEGER NOT NULL,

    INDEX `munka_eszkoz_eszkoz_id_idx`(`eszkoz_id`),
    PRIMARY KEY (`munka_id`, `eszkoz_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `token` (
    `token` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `munka_user` ADD CONSTRAINT `munka_user_munka_id_fkey` FOREIGN KEY (`munka_id`) REFERENCES `munka`(`munka_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `munka_user` ADD CONSTRAINT `munka_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `munka_eszkoz` ADD CONSTRAINT `munka_eszkoz_munka_id_fkey` FOREIGN KEY (`munka_id`) REFERENCES `munka`(`munka_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `munka_eszkoz` ADD CONSTRAINT `munka_eszkoz_eszkoz_id_fkey` FOREIGN KEY (`eszkoz_id`) REFERENCES `eszkoz`(`eszkoz_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `token` ADD CONSTRAINT `token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
