-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  jeu. 25 juin 2020 à 13:14
-- Version du serveur :  5.7.21
-- Version de PHP :  5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `tamarin_ml_complete`
--

-- --------------------------------------------------------

--
-- Structure de la table `area`
--

DROP TABLE IF EXISTS `area`;
CREATE TABLE IF NOT EXISTS `area` (
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `criteria`
--

DROP TABLE IF EXISTS `criteria`;
CREATE TABLE IF NOT EXISTS `criteria` (
  `name` varchar(50) NOT NULL,
  `type_name` varchar(50) NOT NULL,
  `area_name` varchar(50) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`name`),
  KEY `type_name` (`type_name`),
  KEY `area_name` (`area_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `criteriatype`
--

DROP TABLE IF EXISTS `criteriatype`;
CREATE TABLE IF NOT EXISTS `criteriatype` (
  `name` varchar(50) NOT NULL,
  `description` text,
  `order_name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`name`),
  KEY `order_name` (`order_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `criteriatype_has_filter`
--

DROP TABLE IF EXISTS `criteriatype_has_filter`;
CREATE TABLE IF NOT EXISTS `criteriatype_has_filter` (
  `criteriaType_name` varchar(50) NOT NULL DEFAULT '',
  `filter_name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`criteriaType_name`,`filter_name`),
  KEY `filter_name` (`filter_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `criteria_has_sortingorder`
--

DROP TABLE IF EXISTS `criteria_has_sortingorder`;
CREATE TABLE IF NOT EXISTS `criteria_has_sortingorder` (
  `criteria_name` varchar(50) NOT NULL,
  `sortingorder_name` varchar(50) NOT NULL,
  PRIMARY KEY (`criteria_name`,`sortingorder_name`),
  KEY `sortingOrder_name` (`sortingorder_name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `data`
--

DROP TABLE IF EXISTS `data`;
CREATE TABLE IF NOT EXISTS `data` (
  `technology_name` varchar(50) NOT NULL,
  `criteria_name` varchar(50) NOT NULL,
  `value` decimal(11,4) NOT NULL,
  `text` varchar(50) DEFAULT '',
  PRIMARY KEY (`criteria_name`,`technology_name`),
  KEY `technology_name` (`technology_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `filter`
--

DROP TABLE IF EXISTS `filter`;
CREATE TABLE IF NOT EXISTS `filter` (
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `order`
--

DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `sortingorder`
--

DROP TABLE IF EXISTS `sortingorder`;
CREATE TABLE IF NOT EXISTS `sortingorder` (
  `name` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `technology`
--

DROP TABLE IF EXISTS `technology`;
CREATE TABLE IF NOT EXISTS `technology` (
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `criteria`
--
ALTER TABLE `criteria`
  ADD CONSTRAINT `criteria_ibfk_2` FOREIGN KEY (`type_name`) REFERENCES `criteriatype` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `criteria_ibfk_3` FOREIGN KEY (`area_name`) REFERENCES `area` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `criteriatype`
--
ALTER TABLE `criteriatype`
  ADD CONSTRAINT `criteriatype_ibfk_1` FOREIGN KEY (`order_name`) REFERENCES `order` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `criteriatype_has_filter`
--
ALTER TABLE `criteriatype_has_filter`
  ADD CONSTRAINT `criteriatype_has_filter_ibfk_1` FOREIGN KEY (`criteriaType_name`) REFERENCES `criteriatype` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `criteriatype_has_filter_ibfk_2` FOREIGN KEY (`filter_name`) REFERENCES `filter` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `data`
--
ALTER TABLE `data`
  ADD CONSTRAINT `data_ibfk_1` FOREIGN KEY (`criteria_name`) REFERENCES `criteria` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `data_ibfk_2` FOREIGN KEY (`technology_name`) REFERENCES `technology` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
