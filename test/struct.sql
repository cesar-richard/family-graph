-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u8
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Dim 22 Juillet 2018 à 01:25
-- Version du serveur: 5.6.34
-- Version de PHP: 5.4.45-0+deb7u14

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données: `family-graph`
--

-- USE family-graph;

-- --------------------------------------------------------

--
-- Structure de la table `edges`
--

CREATE TABLE IF NOT EXISTS `edges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from` int(11) NOT NULL,
  `to` int(11) NOT NULL,
  `arrows` varchar(20) NOT NULL DEFAULT 'to',
  `dashes` tinyint(1) NOT NULL DEFAULT '0',
  `creator` varchar(15) NOT NULL,
  `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=432 ;

-- --------------------------------------------------------

--
-- Structure de la table `nodes`
--

CREATE TABLE IF NOT EXISTS `nodes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `x` float NOT NULL DEFAULT '0',
  `y` float NOT NULL DEFAULT '0',
  `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=503 ;

-- --------------------------------------------------------

--
-- Structure de la table `visits`
--

CREATE TABLE IF NOT EXISTS `visits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `when` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `route` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=346 ;
