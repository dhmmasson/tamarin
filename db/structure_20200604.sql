# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.15)
# Database: rezbuild_baboon
# Generation Time: 2020-06-04 09:52:42 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table area
# ------------------------------------------------------------

DROP TABLE IF EXISTS `area`;

CREATE TABLE `area` (
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table order
# ------------------------------------------------------------

DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table criteriaType
# ------------------------------------------------------------

DROP TABLE IF EXISTS `criteriaType`;

CREATE TABLE `criteriaType` (
  `name` varchar(50) NOT NULL,
  `description` text,
  `order_name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`name`),
  KEY `order_name` (`order_name`),
  CONSTRAINT `criteriatype_ibfk_1` FOREIGN KEY (`order_name`) REFERENCES `order` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table filter
# ------------------------------------------------------------

DROP TABLE IF EXISTS `filter`;

CREATE TABLE `filter` (
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


# Dump of table criteriaType_has_filter
# ------------------------------------------------------------

DROP TABLE IF EXISTS `criteriaType_has_filter`;

CREATE TABLE `criteriaType_has_filter` (
  `criteriaType_name` varchar(50) NOT NULL DEFAULT '',
  `filter_name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`criteriaType_name`,`filter_name`),
  KEY `filter_name` (`filter_name`),
  CONSTRAINT `criteriatype_has_filter_ibfk_1` FOREIGN KEY (`criteriaType_name`) REFERENCES `criteriaType` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `criteriatype_has_filter_ibfk_2` FOREIGN KEY (`filter_name`) REFERENCES `filter` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table criteria
# ------------------------------------------------------------

DROP TABLE IF EXISTS `criteria`;

CREATE TABLE `criteria` (
  `name` varchar(50) NOT NULL,
  `type_name` varchar(50) NOT NULL,
  `area_name` varchar(50) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`name`),
  KEY `type_name` (`type_name`),
  KEY `area_name` (`area_name`),
  CONSTRAINT `criteria_ibfk_2` FOREIGN KEY (`type_name`) REFERENCES `criteriaType` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `criteria_ibfk_3` FOREIGN KEY (`area_name`) REFERENCES `area` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table technology
# ------------------------------------------------------------

DROP TABLE IF EXISTS `technology`;

CREATE TABLE `technology` (
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table data
# ------------------------------------------------------------

DROP TABLE IF EXISTS `data`;

CREATE TABLE `data` (
  `technology_name` varchar(50) NOT NULL,
  `criteria_name` varchar(50) NOT NULL,
  `value` decimal(11,4) NOT NULL,
  `text` varchar(50) DEFAULT '',
  PRIMARY KEY (`criteria_name`,`technology_name`),
  KEY `technology_name` (`technology_name`),
  CONSTRAINT `data_ibfk_1` FOREIGN KEY (`criteria_name`) REFERENCES `criteria` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `data_ibfk_2` FOREIGN KEY (`technology_name`) REFERENCES `technology` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;






/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
