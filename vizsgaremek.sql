-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:8889
-- Létrehozás ideje: 2026. Ápr 23. 18:33
-- Kiszolgáló verziója: 8.0.40
-- PHP verzió: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `vizsgaremek`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `eszkoz`
--

CREATE TABLE `eszkoz` (
  `eszkoz_id` int NOT NULL,
  `nev` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `darabszam` int NOT NULL,
  `hasznalatban` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `eszkoz`
--

INSERT INTO `eszkoz` (`eszkoz_id`, `nev`, `tipus`, `darabszam`, `hasznalatban`, `isActive`) VALUES
(631, 'Eszköz 1', 'Típus 1', 1, 1, 1),
(632, 'Eszköz 2', 'Típus 2', 2, 1, 1),
(633, 'Eszköz 3', 'Típus 3', 3, 1, 1),
(634, 'Eszköz 4', 'Típus 4', 4, 1, 1),
(635, 'Eszköz 5', 'Típus 5', 5, 1, 1),
(636, 'Eszköz 6', 'Típus 6', 6, 1, 1),
(637, 'Eszköz 7', 'Típus 7', 7, 1, 1),
(638, 'Eszköz 8', 'Típus 8', 8, 1, 1),
(639, 'Eszköz 9', 'Típus 9', 9, 1, 1),
(640, 'Eszköz 10', 'Típus 10', 10, 1, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `feladat`
--

CREATE TABLE `feladat` (
  `feladat_id` int NOT NULL,
  `munka_id` int NOT NULL,
  `leiras` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `isCompleted` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `feladat`
--

INSERT INTO `feladat` (`feladat_id`, `munka_id`, `leiras`, `isCompleted`, `isActive`) VALUES
(2228, 632, 'Feladat 1 - Munka 1', 0, 1),
(2229, 632, 'Feladat 2 - Munka 1', 0, 1),
(2230, 632, 'Feladat 3 - Munka 1', 1, 1),
(2231, 632, 'Feladat 4 - Munka 1', 0, 1),
(2232, 632, 'Feladat 5 - Munka 1', 0, 1),
(2233, 633, 'Feladat 1 - Munka 2', 0, 1),
(2234, 633, 'Feladat 2 - Munka 2', 0, 1),
(2235, 633, 'Feladat 3 - Munka 2', 1, 1),
(2236, 633, 'Feladat 4 - Munka 2', 0, 1),
(2237, 634, 'Feladat 1 - Munka 3', 0, 1),
(2238, 634, 'Feladat 2 - Munka 3', 0, 1),
(2239, 634, 'Feladat 3 - Munka 3', 1, 1),
(2240, 634, 'Feladat 4 - Munka 3', 0, 1),
(2241, 635, 'Feladat 1 - Munka 4', 0, 1),
(2242, 635, 'Feladat 2 - Munka 4', 0, 1),
(2243, 635, 'Feladat 3 - Munka 4', 1, 1),
(2244, 635, 'Feladat 4 - Munka 4', 0, 1),
(2245, 636, 'Feladat 1 - Munka 5', 0, 1),
(2246, 636, 'Feladat 2 - Munka 5', 0, 1),
(2247, 636, 'Feladat 3 - Munka 5', 1, 1),
(2248, 637, 'Feladat 1 - Munka 6', 0, 1),
(2249, 637, 'Feladat 2 - Munka 6', 0, 1),
(2250, 637, 'Feladat 3 - Munka 6', 1, 1),
(2251, 637, 'Feladat 4 - Munka 6', 0, 1),
(2252, 637, 'Feladat 5 - Munka 6', 0, 1),
(2253, 638, 'Feladat 1 - Munka 7', 0, 1),
(2254, 638, 'Feladat 2 - Munka 7', 0, 1),
(2255, 638, 'Feladat 3 - Munka 7', 1, 1),
(2256, 638, 'Feladat 4 - Munka 7', 0, 1),
(2257, 639, 'Feladat 1 - Munka 8', 0, 1),
(2258, 639, 'Feladat 2 - Munka 8', 0, 1),
(2259, 640, 'Feladat 1 - Munka 9', 0, 1),
(2260, 640, 'Feladat 2 - Munka 9', 0, 1),
(2261, 640, 'Feladat 3 - Munka 9', 1, 1),
(2262, 640, 'Feladat 4 - Munka 9', 0, 1),
(2263, 641, 'Feladat 1 - Munka 10', 0, 1),
(2264, 641, 'Feladat 2 - Munka 10', 0, 1),
(2265, 641, 'Feladat 3 - Munka 10', 1, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `munka`
--

CREATE TABLE `munka` (
  `munka_id` int NOT NULL,
  `munka_neve` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ertesitesIsActive` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `kezdeti_datum` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `varhato_befejezes_datuma` datetime(3) NOT NULL,
  `leiras` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `munka`
--

INSERT INTO `munka` (`munka_id`, `munka_neve`, `ertesitesIsActive`, `isActive`, `kezdeti_datum`, `varhato_befejezes_datuma`, `leiras`) VALUES
(632, 'Munka 1', 0, 1, '2026-04-14 07:00:00.000', '2026-04-17 15:00:00.000', 'Ez a munka 1 leírása'),
(633, 'Munka 2', 1, 1, '2026-04-15 07:00:00.000', '2026-04-19 15:00:00.000', 'Ez a munka 2 leírása'),
(634, 'Munka 3', 0, 1, '2026-04-16 07:00:00.000', '2026-04-21 15:00:00.000', 'Ez a munka 3 leírása'),
(635, 'Munka 4', 1, 1, '2026-04-17 07:00:00.000', '2026-04-23 15:00:00.000', 'Ez a munka 4 leírása'),
(636, 'Munka 5', 0, 1, '2026-04-18 07:00:00.000', '2026-04-25 15:00:00.000', 'Ez a munka 5 leírása'),
(637, 'Munka 6', 1, 1, '2026-04-19 07:00:00.000', '2026-04-27 15:00:00.000', 'Ez a munka 6 leírása'),
(638, 'Munka 7', 0, 1, '2026-04-20 07:00:00.000', '2026-04-29 15:00:00.000', 'Ez a munka 7 leírása'),
(639, 'Munka 8', 1, 1, '2026-04-21 07:00:00.000', '2026-05-01 15:00:00.000', 'Ez a munka 8 leírása'),
(640, 'Munka 9', 0, 1, '2026-04-22 07:00:00.000', '2026-05-03 15:00:00.000', 'Ez a munka 9 leírása'),
(641, 'Munka 10', 1, 1, '2026-04-23 07:00:00.000', '2026-05-05 15:00:00.000', 'Ez a munka 10 leírása');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `munka_eszkoz`
--

CREATE TABLE `munka_eszkoz` (
  `munka_id` int NOT NULL,
  `eszkoz_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `munka_eszkoz`
--

INSERT INTO `munka_eszkoz` (`munka_id`, `eszkoz_id`) VALUES
(632, 631),
(632, 632),
(633, 632),
(634, 633),
(634, 634),
(635, 634),
(636, 635),
(636, 636),
(637, 636),
(638, 637),
(638, 638),
(639, 638),
(640, 639),
(640, 640),
(641, 640);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `munka_user`
--

CREATE TABLE `munka_user` (
  `munka_id` int NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `munka_user`
--

INSERT INTO `munka_user` (`munka_id`, `user_id`) VALUES
(632, 695),
(641, 695),
(632, 696),
(633, 696),
(633, 697),
(634, 697),
(633, 698),
(635, 698),
(635, 699),
(636, 699),
(636, 700),
(637, 700),
(636, 701),
(638, 701),
(638, 702),
(639, 702),
(639, 703),
(640, 703),
(639, 704),
(641, 704);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `token`
--

CREATE TABLE `token` (
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `user_id` int NOT NULL,
  `felhasznalonev` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jelszo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nev` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `munkakor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `munkaora` double NOT NULL DEFAULT '8',
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`user_id`, `felhasznalonev`, `email`, `jelszo`, `nev`, `munkakor`, `munkaora`, `isActive`, `isAdmin`) VALUES
(694, 'admin', 'admin@example.com', '$2b$10$6Oh0PZWmfFD7w2TKbFGEz.iu08udfkqLZQX9tefG/gCNs1wLz15C.', 'Administrator', 'Administrator', 8, 1, 1),
(695, 'felhasznalo1', 'felhasznalo1@example.com', '$2b$10$7XI.Skb0FrRandYJoOdaBeaXdw470Wgoju5sX5DxedOrNdkzcYRxK', 'Felhasználó 1', 'Munkakör 1', 8, 1, 0),
(696, 'felhasznalo2', 'felhasznalo2@example.com', '$2b$10$7XI.Skb0FrRandYJoOdaBeaXdw470Wgoju5sX5DxedOrNdkzcYRxK', 'Felhasználó 2', 'Munkakör 2', 8, 1, 0),
(697, 'felhasznalo3', 'felhasznalo3@example.com', '$2b$10$7XI.Skb0FrRandYJoOdaBeaXdw470Wgoju5sX5DxedOrNdkzcYRxK', 'Felhasználó 3', 'Munkakör 3', 8, 1, 0),
(698, 'felhasznalo4', 'felhasznalo4@example.com', '$2b$10$7XI.Skb0FrRandYJoOdaBeaXdw470Wgoju5sX5DxedOrNdkzcYRxK', 'Felhasználó 4', 'Munkakör 4', 8, 1, 0),
(699, 'felhasznalo5', 'felhasznalo5@example.com', '$2b$10$7XI.Skb0FrRandYJoOdaBeaXdw470Wgoju5sX5DxedOrNdkzcYRxK', 'Felhasználó 5', 'Munkakör 5', 8, 1, 0),
(700, 'felhasznalo6', 'felhasznalo6@example.com', '$2b$10$7XI.Skb0FrRandYJoOdaBeaXdw470Wgoju5sX5DxedOrNdkzcYRxK', 'Felhasználó 6', 'Munkakör 6', 8, 1, 0),
(701, 'felhasznalo7', 'felhasznalo7@example.com', '$2b$10$7XI.Skb0FrRandYJoOdaBeaXdw470Wgoju5sX5DxedOrNdkzcYRxK', 'Felhasználó 7', 'Munkakör 7', 8, 1, 0),
(702, 'felhasznalo8', 'felhasznalo8@example.com', '$2b$10$7XI.Skb0FrRandYJoOdaBeaXdw470Wgoju5sX5DxedOrNdkzcYRxK', 'Felhasználó 8', 'Munkakör 8', 8, 1, 0),
(703, 'felhasznalo9', 'felhasznalo9@example.com', '$2b$10$7XI.Skb0FrRandYJoOdaBeaXdw470Wgoju5sX5DxedOrNdkzcYRxK', 'Felhasználó 9', 'Munkakör 9', 8, 1, 0),
(704, 'felhasznalo10', 'felhasznalo10@example.com', '$2b$10$7XI.Skb0FrRandYJoOdaBeaXdw470Wgoju5sX5DxedOrNdkzcYRxK', 'Felhasználó 10', 'Munkakör 10', 8, 1, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('15209b0b-872f-4196-bd35-c12c718cc49a', 'f856948278e705ec5ee141e986e1b404bb9dcc3973e5a77c8ebb62a3d852305d', '2026-04-19 11:22:01.861', '20260118115458_migrate', NULL, NULL, '2026-04-19 11:22:01.802', 1),
('b5e36812-b51c-48ac-ac8d-06a64a447199', '47e78e3c0ae8e3d6ef7fe7f7774e53f2346dcc29b654c7941920e38de075062a', '2026-04-19 11:22:05.883', '20260419112205_add_many_to_many_relations', NULL, NULL, '2026-04-19 11:22:05.828', 1),
('e19d8321-09b4-40f3-a53f-7995948388a2', '75089632470c5b354862c8c1bbe8b9b22a64be35047ef72a964b8596bfc90e48', '2026-04-19 11:22:01.866', '20260121110114_default', NULL, NULL, '2026-04-19 11:22:01.861', 1);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `eszkoz`
--
ALTER TABLE `eszkoz`
  ADD PRIMARY KEY (`eszkoz_id`),
  ADD UNIQUE KEY `eszkoz_nev_key` (`nev`);

--
-- A tábla indexei `feladat`
--
ALTER TABLE `feladat`
  ADD PRIMARY KEY (`feladat_id`),
  ADD KEY `feladat_munka_id_fkey` (`munka_id`);

--
-- A tábla indexei `munka`
--
ALTER TABLE `munka`
  ADD PRIMARY KEY (`munka_id`),
  ADD UNIQUE KEY `munka_munka_neve_key` (`munka_neve`);

--
-- A tábla indexei `munka_eszkoz`
--
ALTER TABLE `munka_eszkoz`
  ADD PRIMARY KEY (`munka_id`,`eszkoz_id`),
  ADD KEY `munka_eszkoz_eszkoz_id_idx` (`eszkoz_id`);

--
-- A tábla indexei `munka_user`
--
ALTER TABLE `munka_user`
  ADD PRIMARY KEY (`munka_id`,`user_id`),
  ADD KEY `munka_user_user_id_idx` (`user_id`);

--
-- A tábla indexei `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`token`),
  ADD KEY `token_user_id_fkey` (`user_id`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_felhasznalonev_key` (`felhasznalonev`),
  ADD UNIQUE KEY `user_email_key` (`email`);

--
-- A tábla indexei `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `eszkoz`
--
ALTER TABLE `eszkoz`
  MODIFY `eszkoz_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=641;

--
-- AUTO_INCREMENT a táblához `feladat`
--
ALTER TABLE `feladat`
  MODIFY `feladat_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2266;

--
-- AUTO_INCREMENT a táblához `munka`
--
ALTER TABLE `munka`
  MODIFY `munka_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=642;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=705;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `feladat`
--
ALTER TABLE `feladat`
  ADD CONSTRAINT `feladat_munka_id_fkey` FOREIGN KEY (`munka_id`) REFERENCES `munka` (`munka_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `munka_eszkoz`
--
ALTER TABLE `munka_eszkoz`
  ADD CONSTRAINT `munka_eszkoz_eszkoz_id_fkey` FOREIGN KEY (`eszkoz_id`) REFERENCES `eszkoz` (`eszkoz_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `munka_eszkoz_munka_id_fkey` FOREIGN KEY (`munka_id`) REFERENCES `munka` (`munka_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `munka_user`
--
ALTER TABLE `munka_user`
  ADD CONSTRAINT `munka_user_munka_id_fkey` FOREIGN KEY (`munka_id`) REFERENCES `munka` (`munka_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `munka_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
