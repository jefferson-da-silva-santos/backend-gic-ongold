-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: db_gic
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_itens`
--

DROP TABLE IF EXISTS `tb_itens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_itens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `valor_unitario` decimal(10,2) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `taxa_icms_entrada` decimal(5,2) DEFAULT NULL,
  `taxa_icms_saida` decimal(5,2) DEFAULT NULL,
  `comissao` decimal(5,2) DEFAULT NULL,
  `ncm_id` int DEFAULT NULL,
  `cst_id` int DEFAULT NULL,
  `cfop_id` int DEFAULT NULL,
  `ean` varchar(13) NOT NULL,
  `excluido` tinyint(1) DEFAULT '0',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `excluido_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ean` (`ean`),
  KEY `ncm` (`ncm_id`),
  KEY `cst` (`cst_id`),
  KEY `cfop` (`cfop_id`),
  CONSTRAINT `tb_itens_ibfk_1` FOREIGN KEY (`ncm_id`) REFERENCES `tb_ncm` (`idncm`),
  CONSTRAINT `tb_itens_ibfk_2` FOREIGN KEY (`cst_id`) REFERENCES `tb_csticms` (`idcst`),
  CONSTRAINT `tb_itens_ibfk_3` FOREIGN KEY (`cfop_id`) REFERENCES `tb_cfop` (`idcfop`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_itens`
--

LOCK TABLES `tb_itens` WRITE;
/*!40000 ALTER TABLE `tb_itens` DISABLE KEYS */;
INSERT INTO `tb_itens` VALUES (1,5.75,'Biscoito Oreo 90g',18.00,12.00,3.00,1,2,3,'7891000240012',0,'2025-03-06 10:40:11',NULL),(2,12.90,'Arroz Branco 5kg',18.00,12.00,4.00,4,4,4,'7896076800019',0,'2025-03-06 10:40:11',NULL),(3,8.99,'Feijão Carioca 1kg',18.00,12.00,3.50,4,5,3,'7891000102012',0,'2025-03-06 10:40:11',NULL),(4,99.90,'Produto Inserido 3',18.50,14.90,10.00,3,4,3,'1232145432290',0,'2025-03-06 20:49:21',NULL),(5,2000.00,'Produto Inserido de novo',34.00,43.00,89.00,10659,18,669,'8787888787878',0,'2025-03-07 01:38:07',NULL);
/*!40000 ALTER TABLE `tb_itens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-06 23:14:51
