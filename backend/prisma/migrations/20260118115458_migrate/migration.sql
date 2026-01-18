-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `felhasznalonev` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `jelszo` VARCHAR(191) NOT NULL,
    `nev` VARCHAR(191) NOT NULL,
    `munkakor` VARCHAR(191) NOT NULL,
    `munkaora` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `user_felhasznalonev_key`(`felhasznalonev`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eszkoz` (
    `eszkoz_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nev` VARCHAR(191) NOT NULL,
    `tipus` VARCHAR(191) NOT NULL,
    `darabszam` INTEGER NOT NULL,
    `hasznalatban` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `eszkoz_nev_key`(`nev`),
    PRIMARY KEY (`eszkoz_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feladat` (
    `feladat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `munka_id` INTEGER NOT NULL,
    `leiras` TEXT NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`feladat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `munka` (
    `munka_id` INTEGER NOT NULL AUTO_INCREMENT,
    `munka_neve` VARCHAR(191) NOT NULL,
    `eszkoz_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `ertesitesIsActive` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `kezdeti_datum` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `varhato_befejezes_datuma` DATETIME(3) NOT NULL,

    UNIQUE INDEX `munka_munka_neve_key`(`munka_neve`),
    PRIMARY KEY (`munka_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `munka_id` INTEGER NOT NULL,
    `uzenet` TEXT NOT NULL,
    `kuldesi_ido` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `delete` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feladat` ADD CONSTRAINT `feladat_munka_id_fkey` FOREIGN KEY (`munka_id`) REFERENCES `munka`(`munka_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `munka` ADD CONSTRAINT `munka_eszkoz_id_fkey` FOREIGN KEY (`eszkoz_id`) REFERENCES `eszkoz`(`eszkoz_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `munka` ADD CONSTRAINT `munka_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_munka_id_fkey` FOREIGN KEY (`munka_id`) REFERENCES `munka`(`munka_id`) ON DELETE CASCADE ON UPDATE CASCADE;
