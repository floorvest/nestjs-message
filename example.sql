-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 18, 2024 at 12:01 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `happybirthday`
--

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `email_templates`
--

INSERT INTO `email_templates` (`id`, `name`, `message`, `keywords`, `created_at`, `updated_at`) VALUES
(1, 'send_happy_birthday', 'Hey, {full_name} it’s your birthday!', 'full_name', '2024-02-18 00:00:00.000000', '2024-02-18 13:29:28.823284'),
(2, 'send_happy_birthday_longer', 'Happy Birthday, {full_name}! Wishing you a day filled with joy, laughter, and unforgettable moments! ??', 'full_name', '2024-02-18 00:00:00.000000', '2024-02-18 00:00:00.000000'),
(3, 'send_happy_anniversary', 'Congratulations on your anniversary, {full_name}! May your love continue to grow stronger with each passing day. ??', 'full_name', '2024-02-18 00:00:00.000000', '2024-02-18 00:00:00.000000');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` int(11) NOT NULL,
  `job_key` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `information` text,
  `failed_reason` text,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `job_key` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `information` longtext,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `triggered_at` datetime NOT NULL,
  `attempt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `job_key`, `userId`, `information`, `created_at`, `updated_at`, `triggered_at`, `attempt`) VALUES
(7, '4b4446c4-61aa-4bf7-a0e9-b353a75bba19', 2, '{\"job\":\"send_happy_birthday\",\"data\":{\"full_name\":\"Dean Winchester\"},\"email\":\"dean.winchester@gmail.com\"}', '2024-02-18 15:51:36.099851', '2024-02-18 15:51:36.099851', '2024-02-18 21:00:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `timezone` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `last_announce_birthday` int(11) NOT NULL DEFAULT '0',
  `birth_date` date NOT NULL,
  `is_married` tinyint(4) NOT NULL DEFAULT '0',
  `marriage_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `timezone`, `location`, `first_name`, `last_name`, `last_announce_birthday`, `birth_date`, `is_married`, `marriage_date`) VALUES
(1, 'patranto.prabowo@gmail.com', 'Asia/Jakarta', 'Jakarta', 'Patranto', 'Prabowo', 2024, '2024-02-02', 0, NULL),
(2, 'dean.winchester@gmail.com', 'Asia/Jakarta', 'Jakarta', 'Dean', 'Winchester', 2023, '2024-02-02', 0, NULL),
(3, 'sam.winchester@gmail.com', 'Asia/Singapore', 'Singapore', 'Sam', 'Winchester', 2024, '2024-02-01', 0, NULL),
(8, 'floorvest@gmail.com', 'Asia/Jakarta', 'Jakarta', 'Kusnadi', 'Mulyana', 0, '2024-02-02', 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
