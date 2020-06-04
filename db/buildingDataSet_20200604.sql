# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.15)
# Database: rezbuild_baboon
# Generation Time: 2020-06-04 09:53:19 +0000
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

LOCK TABLES `area` WRITE;
/*!40000 ALTER TABLE `area` DISABLE KEYS */;

INSERT INTO `area` (`name`, `description`)
VALUES
	('economic',NULL),
	('energy',NULL),
	('environmental',NULL),
	('financial','everything related to money'),
	('risk',NULL),
	('social',NULL),
	('time',NULL);

/*!40000 ALTER TABLE `area` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table criteria
# ------------------------------------------------------------

LOCK TABLES `criteria` WRITE;
/*!40000 ALTER TABLE `criteria` DISABLE KEYS */;

INSERT INTO `criteria` (`name`, `type_name`, `area_name`, `unit`, `description`)
VALUES
	('CO2 Emissions Reduction','numeric','Economic','',''),
	('Comfort','numeric','Social','',''),
	('Ecosystem quality','numeric','Environmental','','Ecosystem Quality'),
	('Human Health','numeric','Environmental','',''),
	('name','text','Time',NULL,NULL),
	('Profitability','numeric','Economic','',''),
	('Ressources comsumption','numeric','Environmental','','');

/*!40000 ALTER TABLE `criteria` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table criteriaType
# ------------------------------------------------------------

LOCK TABLES `criteriaType` WRITE;
/*!40000 ALTER TABLE `criteriaType` DISABLE KEYS */;

INSERT INTO `criteriaType` (`name`, `description`, `order_name`)
VALUES
	('date','date ou temps','numerical'),
	('duree','durée','numerical'),
	('Economic',NULL,'numerical'),
	('Environmental ',NULL,'numerical'),
	('numeric','nimporte quelle valeur numérique simple :  prix, surface, watt','numerical'),
	('region','spain, uk, norway, italy, france','alphabetical'),
	('Social',NULL,'numerical'),
	('text','nimporte quel texte','alphabetical');

/*!40000 ALTER TABLE `criteriaType` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table criteriaType_has_filter
# ------------------------------------------------------------

LOCK TABLES `criteriaType_has_filter` WRITE;
/*!40000 ALTER TABLE `criteriaType_has_filter` DISABLE KEYS */;

INSERT INTO `criteriaType_has_filter` (`criteriaType_name`, `filter_name`)
VALUES
	('numeric','5best'),
	('text','equals'),
	('numeric','topPercentile');

/*!40000 ALTER TABLE `criteriaType_has_filter` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table data
# ------------------------------------------------------------

LOCK TABLES `data` WRITE;
/*!40000 ALTER TABLE `data` DISABLE KEYS */;

INSERT INTO `data` (`technology_name`, `criteria_name`, `value`, `text`)
VALUES
	('AAC','CO2 Emissions Reduction',3.3326,''),
	('Corkslab','CO2 Emissions Reduction',4.2641,''),
	('ExpandPerlite','CO2 Emissions Reduction',4.2932,''),
	('FibreboardHard','CO2 Emissions Reduction',4.5830,''),
	('GlassWool','CO2 Emissions Reduction',4.6796,''),
	('GypsumFibreboard','CO2 Emissions Reduction',0.7345,''),
	('HempFibres','CO2 Emissions Reduction',4.4564,''),
	('KenafFibres','CO2 Emissions Reduction',4.6548,''),
	('MineralizedWood','CO2 Emissions Reduction',3.7547,''),
	('Plywood','CO2 Emissions Reduction',0.0000,''),
	('PolystyreneFoam','CO2 Emissions Reduction',4.6693,''),
	('Polyurethane','CO2 Emissions Reduction',5.0000,''),
	('RockWool','CO2 Emissions Reduction',4.7312,''),
	('AAC','Comfort',3.2099,''),
	('Corkslab','Comfort',4.2789,''),
	('ExpandPerlite','Comfort',4.3733,''),
	('FibreboardHard','Comfort',4.6489,''),
	('GlassWool','Comfort',4.6207,''),
	('GypsumFibreboard','Comfort',0.6839,''),
	('HempFibres','Comfort',4.3408,''),
	('KenafFibres','Comfort',4.6165,''),
	('MineralizedWood','Comfort',3.7901,''),
	('Plywood','Comfort',0.0000,''),
	('PolystyreneFoam','Comfort',4.5406,''),
	('Polyurethane','Comfort',5.0000,''),
	('RockWool','Comfort',4.6470,''),
	('AAC','Ecosystem quality',4.9896,''),
	('Corkslab','Ecosystem quality',4.5485,''),
	('ExpandPerlite','Ecosystem quality',4.9865,''),
	('FibreboardHard','Ecosystem quality',4.6445,''),
	('GlassWool','Ecosystem quality',4.9729,''),
	('GypsumFibreboard','Ecosystem quality',4.9080,''),
	('HempFibres','Ecosystem quality',4.9288,''),
	('KenafFibres','Ecosystem quality',4.6291,''),
	('MineralizedWood','Ecosystem quality',4.8923,''),
	('Plywood','Ecosystem quality',0.0000,''),
	('PolystyreneFoam','Ecosystem quality',5.0000,''),
	('Polyurethane','Ecosystem quality',4.9914,''),
	('RockWool','Ecosystem quality',4.9849,''),
	('AAC','Human Health',4.6055,''),
	('Corkslab','Human Health',3.9406,''),
	('ExpandPerlite','Human Health',4.7797,''),
	('FibreboardHard','Human Health',3.0309,''),
	('GlassWool','Human Health',4.5571,''),
	('GypsumFibreboard','Human Health',2.6015,''),
	('HempFibres','Human Health',5.0000,''),
	('KenafFibres','Human Health',4.8702,''),
	('MineralizedWood','Human Health',2.8263,''),
	('Plywood','Human Health',0.0000,''),
	('PolystyreneFoam','Human Health',4.9751,''),
	('Polyurethane','Human Health',4.4170,''),
	('RockWool','Human Health',4.0979,''),
	('AAC','Profitability',3.8590,''),
	('Corkslab','Profitability',3.8335,''),
	('ExpandPerlite','Profitability',4.6384,''),
	('FibreboardHard','Profitability',3.1321,''),
	('GlassWool','Profitability',4.4685,''),
	('GypsumFibreboard','Profitability',1.1754,''),
	('HempFibres','Profitability',4.7810,''),
	('KenafFibres','Profitability',4.9209,''),
	('MineralizedWood','Profitability',3.1685,''),
	('Plywood','Profitability',0.0000,''),
	('PolystyreneFoam','Profitability',4.5613,''),
	('Polyurethane','Profitability',4.7128,''),
	('RockWool','Profitability',5.0000,''),
	('AAC','Ressources comsumption',4.5199,''),
	('Corkslab','Ressources comsumption',3.5900,''),
	('ExpandPerlite','Ressources comsumption',3.4917,''),
	('FibreboardHard','Ressources comsumption',0.0000,''),
	('GlassWool','Ressources comsumption',3.8637,''),
	('GypsumFibreboard','Ressources comsumption',2.4716,''),
	('HempFibres','Ressources comsumption',4.8076,''),
	('KenafFibres','Ressources comsumption',5.0000,''),
	('MineralizedWood','Ressources comsumption',1.9959,''),
	('Plywood','Ressources comsumption',0.3819,''),
	('PolystyreneFoam','Ressources comsumption',4.4957,''),
	('Polyurethane','Ressources comsumption',3.4917,''),
	('RockWool','Ressources comsumption',4.7461,'');

/*!40000 ALTER TABLE `data` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table filter
# ------------------------------------------------------------

LOCK TABLES `filter` WRITE;
/*!40000 ALTER TABLE `filter` DISABLE KEYS */;

INSERT INTO `filter` (`name`, `description`)
VALUES
	('5best',NULL),
	('equals',NULL),
	('exists',NULL),
	('TopPercentile',NULL);

/*!40000 ALTER TABLE `filter` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table order
# ------------------------------------------------------------

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;

INSERT INTO `order` (`name`, `description`)
VALUES
	('alphabetical',NULL),
	('numerical',NULL);

/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table technology
# ------------------------------------------------------------

LOCK TABLES `technology` WRITE;
/*!40000 ALTER TABLE `technology` DISABLE KEYS */;

INSERT INTO `technology` (`name`, `description`)
VALUES
	('AAC','Autoclave aerated complete'),
	('Corkslab','Corkslab'),
	('ExpandPerlite','Expanded perlite'),
	('FibreboardHard','Fibreboard hard'),
	('GlassWool','Glass wool'),
	('GypsumFibreboard','Gypsum fibreboard'),
	('HempFibres','Hemp fibres'),
	('KenafFibres','Kenaf fibres'),
	('MineralizedWood','Mineralized wood'),
	('Plywood','Plywood'),
	('PolystyreneFoam','Polystyrene foam'),
	('Polyurethane','Polyurethane'),
	('RockWool','Rock wool');

/*!40000 ALTER TABLE `technology` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
