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
-- Table structure for table `tb_csticms`
--

DROP TABLE IF EXISTS `tb_csticms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_csticms` (
  `idcst` int NOT NULL AUTO_INCREMENT,
  `codcst` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `regime` varchar(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`idcst`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_csticms`
--

LOCK TABLES `tb_csticms` WRITE;
/*!40000 ALTER TABLE `tb_csticms` DISABLE KEYS */;
INSERT INTO `tb_csticms` VALUES (1,'000','Tributada Integralmente','T'),(2,'010','Tributada com cobrança de ICMS por ST','T'),(3,'020','Com Redução de Base de Cálculo','T'),(4,'030','Isenta ou não Tributada e com Cobrança do ICMS por ST','T'),(5,'040','Isenta','T'),(6,'041','Não tributada','T'),(7,'050','Com suspensão','T'),(8,'051','Com diferimento','T'),(9,'060','ICMS cobrado anteriormente por ST','T'),(10,'061','Tributação monofásica sobre combustíveis cobrada anteriormente','T'),(11,'070','Com redução de base de cálculo e Cobrança do ICMS por ST','T'),(12,'090','Outras','T'),(13,'101','Tributada pelo Simples Nacional com permissão de crédito','S'),(14,'102','Tributada pelo Simples Nacional sem permissão de crédito','S'),(15,'103','Isenção do ICMS no Simples Nacional para faixa de receita bruta','S'),(16,'201','Tributada pelo Simples Nacional com permissão de crédito e com cobrança do ICMS por ST','S'),(17,'202','Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por ST','S'),(18,'203','Isenção do ICMS no Simples Nacional para faixa de receita bruta e com cobrança do ICMS por ST','S'),(19,'300','Imune','S'),(20,'400','Não tributada pelo Simples Nacional','S'),(21,'500','ICMS cobrado anteriormente por ST ou por antecipação','S'),(22,'900','Outros','S');
/*!40000 ALTER TABLE `tb_csticms` ENABLE KEYS */;
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
