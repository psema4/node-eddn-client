CREATE DATABASE IF NOT EXISTS eddn;
USE eddn;

DROP TABLE IF EXISTS markets;

CREATE TABLE markets (
    id integer auto_increment primary key,
	systemName varchar(64) not null,
	stationName varchar(64) not null,
	itemName varchar(64) not null,
	stationStock float default 0.0,
	demand float default 0.0,
	buyPrice float default 0.0,
	sellPrice float default 0.0,
	categoryName varchar(64) default '',
 	`timestamp` varchar(64)
);

-- GRANT SELECT, INSERT ON `eddn`.`markets` to 'eddn'@'localhost' IDENTIFIED BY 'eddnpass';

-- SAMPLE REPORTS
--
-- Market Info
--   SELECT * FROM markets ORDER BY systemName, stationName, itemName;
--
-- Distinct Systems
--   SELECT DISTINCT systemName FROM markets ORDER BY systemName;
--
-- Distinct Stations
--   SELECT DISTINCT stationName, systemName FROM markets ORDER BY systemName, stationName;

