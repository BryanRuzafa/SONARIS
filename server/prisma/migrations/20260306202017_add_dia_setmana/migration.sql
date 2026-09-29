-- CreateTable
CREATE TABLE `usuaris` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `cognoms` VARCHAR(191) NULL,
    `correu` VARCHAR(191) NULL,
    `spotify_id` VARCHAR(191) NOT NULL,
    `foto_perfil` VARCHAR(191) NULL,
    `data_registre` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_actualitzacio` DATETIME(3) NOT NULL,
    `token_acces` TEXT NULL,
    `refresh_token` TEXT NULL,

    UNIQUE INDEX `usuaris_correu_key`(`correu`),
    UNIQUE INDEX `usuaris_spotify_id_key`(`spotify_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entrades_diari` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuari_id` INTEGER NOT NULL,
    `text_entrada` TEXT NOT NULL,
    `estat_anim` VARCHAR(191) NULL,
    `canco_suggerida` VARCHAR(191) NULL,
    `caratula_url` VARCHAR(191) NULL,
    `data_entrada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configuracio_radar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuari_id` INTEGER NOT NULL,
    `generes_preferits` TEXT NOT NULL,
    `limit_popularitat` INTEGER NOT NULL DEFAULT 30,
    `radar_actiu` BOOLEAN NOT NULL DEFAULT true,
    `autoneteja_activa` BOOLEAN NOT NULL DEFAULT false,
    `dia_setmana` INTEGER NOT NULL DEFAULT 5,

    UNIQUE INDEX `configuracio_radar_usuari_id_key`(`usuari_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales_joc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codi_sala` VARCHAR(191) NOT NULL,
    `tipus` VARCHAR(191) NOT NULL,
    `estat` VARCHAR(191) NOT NULL DEFAULT 'esperant',
    `data_creacio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sales_joc_codi_sala_key`(`codi_sala`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participants_sala` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuari_id` INTEGER NOT NULL,
    `sala_id` INTEGER NOT NULL,
    `puntuacio` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `entrades_diari` ADD CONSTRAINT `entrades_diari_usuari_id_fkey` FOREIGN KEY (`usuari_id`) REFERENCES `usuaris`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configuracio_radar` ADD CONSTRAINT `configuracio_radar_usuari_id_fkey` FOREIGN KEY (`usuari_id`) REFERENCES `usuaris`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participants_sala` ADD CONSTRAINT `participants_sala_usuari_id_fkey` FOREIGN KEY (`usuari_id`) REFERENCES `usuaris`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participants_sala` ADD CONSTRAINT `participants_sala_sala_id_fkey` FOREIGN KEY (`sala_id`) REFERENCES `sales_joc`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
