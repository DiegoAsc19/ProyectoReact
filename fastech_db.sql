/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.14-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: fastech_db
-- ------------------------------------------------------
-- Server version	10.11.14-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_carrito`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_compras`
--

DROP TABLE IF EXISTS `historial_compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_compras` (
  `id_compra` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_compra`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_compras`
--

LOCK TABLES `historial_compras` WRITE;
/*!40000 ALTER TABLE `historial_compras` DISABLE KEYS */;
INSERT INTO `historial_compras` VALUES
(1,3,15,1,33.00,'2026-05-18 21:07:31'),
(2,5,15,1,33.00,'2026-05-18 21:08:42'),
(3,5,14,1,45.00,'2026-05-19 08:27:31'),
(4,3,14,1,45.00,'2026-05-19 09:29:22'),
(5,3,14,1,45.00,'2026-05-21 07:53:25'),
(6,3,14,1,45.00,'2026-05-21 08:16:27');
/*!40000 ALTER TABLE `historial_compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_url` text DEFAULT NULL,
  `especificaciones` text DEFAULT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES
(9,'HP Laptop 15-FD0051LA AMD Ryzen 5',890.00,1,'Computadora portátil ideal para estudiantes de desarrollo de software, tareas académicas y productividad diaria. Ofrece un diseño elegante, teclado completo y una excelente gestión térmica para largas jornadas de estudio o trabajo local en entornos Linux.','https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60','AMD Ryzen 5 7520U, 16 GB RAM LPDDR5, 512 GB SSD NVMe, Pantalla 15.6\" FHD, AMD Radeon 610M.'),
(13,'Procesador AMD Ryzen 5 5600G AM4',135.00,1,'El procesador rey del costo-rendimiento. Ideal para usuarios que quieren armar una PC de escritorio capaz de correr herramientas de programación y videojuegos competitivos como Fortnite o Dota 2 sin necesidad de gastar inmediatamente en una tarjeta gráfica dedicada.','https://cdn.shopify.com/s/files/1/0533/2189/2030/products/amd-ryzen-5-5600g-box-1_700x700.jpg','6 Núcleos, 12 Hilos, Frecuencia Base 3.9 GHz (Boost 4.4 GHz), Gráficos integrados Radeon Vega 7, TDP 65W.'),
(14,'Memoria RAM Kingston FURY Impact DDR4 SO-DIMM',45.00,5,'Módulo de memoria RAM de alto rendimiento para notebooks. Perfecta para actualizar tu equipo de 8 GB a 16 GB o más, optimizando el rendimiento al compilar código, ejecutar entornos virtuales o mejorar los FPS en juegos.','https://media.kingston.com/images/products/fury-impact-ddr4-sodimm-single-module-lg.jpg','Capacidad 8 GB, Tipo DDR4, Velocidad 3200 MHz, Formato SO-DIMM (Laptop), Latencia CL20, Voltaje 1.2V.'),
(15,'Mouse Logitech G305 Lightspeed Wireless',33.00,19,'Mouse inalámbrico para gaming con tecnología Lightspeed que garantiza una respuesta instantánea y sin retrasos. Su diseño ergonómico y peso ligero lo hacen el preferido tanto para extensas sesiones de juego como para largas jornadas de desarrollo.','https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60','Sensor óptico HERO de 12,000 DPI, Conexión inalámbrica de 1 ms, Autónoma de hasta 250 horas, 6 botones programables.');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `rol` varchar(20) DEFAULT 'cliente',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES
(1,'Diego Admin','admin@fastech.com','admin123','admin'),
(2,'Carlos Cliente','cliente@fastech.com','cliente123','cliente'),
(3,'ronald','roni@cliente.com','1234','cliente'),
(4,'diego ascencio','diego@noni.com','2121','cliente'),
(5,'Diana','diana@gmail.com','4321','cliente');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-26 11:21:36
