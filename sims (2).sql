-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 03, 2018 at 08:48 AM
-- Server version: 5.7.23-0ubuntu0.16.04.1
-- PHP Version: 7.0.32-1+ubuntu16.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sims`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts_tbl`
--

CREATE TABLE `accounts_tbl` (
  `account_no` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `account_type` varchar(20) NOT NULL,
  `is_activated` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `accounts_tbl`
--

INSERT INTO `accounts_tbl` (`account_no`, `username`, `password`, `last_name`, `first_name`, `account_type`, `is_activated`) VALUES
(1, 'blairwaldorf', '$2a$10$Nsu.UojRxZSq/UvudEP16erciWF56XH6XLe6jM/hbktSYGvnP13sW', 'Waldorf', 'Blair', 'superadmin', 1),
(2, 'kangtaejun', '$2a$10$wdIbichNk1bOmakF8dAwUezTQLmkafajvD0kK1ptXinQp5k24zJI6', 'Valenciano', 'Rafael', 'customer', 0);

-- --------------------------------------------------------

--
-- Table structure for table `addressbook_tbl`
--

CREATE TABLE `addressbook_tbl` (
  `address_no` int(11) NOT NULL,
  `customer_no` int(11) NOT NULL,
  `phone_number` varchar(10) NOT NULL,
  `street_address` varchar(100) NOT NULL,
  `street_address_2` varchar(100) NOT NULL,
  `city` varchar(20) NOT NULL,
  `province` varchar(20) NOT NULL,
  `zip_code` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `cart_tbl`
--

CREATE TABLE `cart_tbl` (
  `cart_no` int(11) NOT NULL,
  `customer_no` int(11) NOT NULL,
  `item_no` int(11) NOT NULL,
  `product_sku` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_per_piece` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customer_tbl`
--

CREATE TABLE `customer_tbl` (
  `customer_no` int(11) NOT NULL,
  `account_no` int(11) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `email_address` varchar(50) NOT NULL,
  `successful_trans` int(11) NOT NULL DEFAULT '0',
  `cancelled_trans` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_tbl`
--

INSERT INTO `customer_tbl` (`customer_no`, `account_no`, `last_name`, `first_name`, `email_address`, `successful_trans`, `cancelled_trans`) VALUES
(1, 2, 'Valenciano', 'Rafael', 'valencianorafaelroman@gmail.com', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `demand_tbl`
--

CREATE TABLE `demand_tbl` (
  `demand_no` int(11) NOT NULL,
  `product_sku` varchar(255) NOT NULL,
  `timeframe_start` date NOT NULL,
  `timeframe_end` date NOT NULL,
  `item_sold` int(11) NOT NULL,
  `jacket_made` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_tbl`
--

CREATE TABLE `inventory_tbl` (
  `product_no` int(11) NOT NULL,
  `product_slug` varchar(6) NOT NULL,
  `product_category` varchar(50) NOT NULL,
  `product_origin` varchar(50) NOT NULL,
  `product_name` varchar(80) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `product_cog` decimal(10,2) NOT NULL,
  `product_desc` longtext NOT NULL,
  `total_stock` int(11) NOT NULL,
  `available_stock` int(11) NOT NULL DEFAULT '0',
  `reserved_stock` int(11) NOT NULL DEFAULT '0',
  `jacket_made` int(11) NOT NULL DEFAULT '0',
  `jacket_sold` int(11) NOT NULL DEFAULT '0',
  `is_phased_out` char(1) NOT NULL DEFAULT '0',
  `is_deleted` char(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inventory_tbl`
--

INSERT INTO `inventory_tbl` (`product_no`, `product_slug`, `product_category`, `product_origin`, `product_name`, `product_price`, `product_cog`, `product_desc`, `total_stock`, `available_stock`, `reserved_stock`, `jacket_made`, `jacket_sold`, `is_phased_out`, `is_deleted`) VALUES
(1, 'MVHPRC', 'Movies', 'Harry Potter', 'Ravenclaw Inspired Jacket', '1200.00', '600.00', 'Ravenclaw. Duuuhhh', 30, 0, 0, 30, 0, '0', '0'),
(2, 'TVRDCL', 'TV Series', 'Riverdale', 'Cheerleader Varsity Inspired Jacket', '1200.00', '600.00', 'Cheerleader like Cheryl Blossom', 10, 0, 0, 10, 0, '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `order_tbl`
--

CREATE TABLE `order_tbl` (
  `item_no` int(11) NOT NULL,
  `transaction_no` int(11) NOT NULL,
  `product_sku` varchar(8) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `payment_tbl`
--

CREATE TABLE `payment_tbl` (
  `payment_no` int(11) NOT NULL,
  `transaction_no` int(11) NOT NULL,
  `payors_name` varchar(50) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_mode` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `is_deleted` char(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productimage_tbl`
--

CREATE TABLE `productimage_tbl` (
  `image_no` int(11) NOT NULL,
  `product_no` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `product_tbl`
--

CREATE TABLE `product_tbl` (
  `product_sku` varchar(8) NOT NULL,
  `product_no` int(11) NOT NULL,
  `product_sizeslug` varchar(2) NOT NULL,
  `product_sizename` varchar(15) NOT NULL,
  `total_stock` int(11) NOT NULL,
  `available_stock` int(11) NOT NULL,
  `reserved_stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_tbl`
--

INSERT INTO `product_tbl` (`product_sku`, `product_no`, `product_sizeslug`, `product_sizename`, `total_stock`, `available_stock`, `reserved_stock`) VALUES
('MVHPRC-S', 1, '-S', 'Small', 20, 20, 0),
('MVHPRCXL', 1, 'XL', 'Extra Large', 10, 10, 0),
('TVRDCL-S', 2, '-S', 'Small', 10, 10, 0);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('rgtmKp6bBeGRxIS2cH7AMdfVmVK1RvST', 3079581955, '{"cookie":{"originalMaxAge":1541048255725,"expires":"2067-08-02T10:26:15.479Z","httpOnly":true,"path":"/"},"flash":{},"passport":{"user":[{"account_no":1,"username":"blairwaldorf","password":"$2a$10$Nsu.UojRxZSq/UvudEP16erciWF56XH6XLe6jM/hbktSYGvnP13sW","last_name":"Waldorf","first_name":"Blair","account_type":"superadmin","is_activated":1}]}}');

-- --------------------------------------------------------

--
-- Table structure for table `shipping_tbl`
--

CREATE TABLE `shipping_tbl` (
  `shipping_no` int(11) NOT NULL,
  `transaction_no` int(11) NOT NULL,
  `courier` varchar(50) NOT NULL,
  `release_date` date NOT NULL,
  `shipping_notes` longtext NOT NULL,
  `is_deleted` char(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stallitems_tbl`
--

CREATE TABLE `stallitems_tbl` (
  `stallitem_no` int(11) NOT NULL,
  `stalltransaction_no` int(11) NOT NULL,
  `product_sku` varchar(8) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stalltransaction_tbl`
--

CREATE TABLE `stalltransaction_tbl` (
  `stalltransaction_no` int(11) NOT NULL,
  `event_name` varchar(80) NOT NULL,
  `event_place` varchar(80) NOT NULL,
  `event_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `is_deleted` char(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stocks_tbl`
--

CREATE TABLE `stocks_tbl` (
  `batch_no` int(11) NOT NULL,
  `product_no` int(11) NOT NULL,
  `product_sku` varchar(8) NOT NULL,
  `production_date` date NOT NULL,
  `batch_cog` decimal(10,2) NOT NULL,
  `initial_stock` int(11) NOT NULL,
  `stock_left` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stocks_tbl`
--

INSERT INTO `stocks_tbl` (`batch_no`, `product_no`, `product_sku`, `production_date`, `batch_cog`, `initial_stock`, `stock_left`) VALUES
(1, 1, 'MVHPRC-S', '2018-10-02', '600.00', 20, 20),
(2, 1, 'MVHPRCXL', '2018-10-02', '600.00', 10, 10),
(3, 2, 'TVRDCL-S', '2018-10-02', '1200.00', 10, 10);

-- --------------------------------------------------------

--
-- Table structure for table `transaction_tbl`
--

CREATE TABLE `transaction_tbl` (
  `transaction_no` int(11) NOT NULL,
  `customer_no` int(11) NOT NULL,
  `transaction_date` date NOT NULL,
  `status` char(255) NOT NULL,
  `payment_deadline` date NOT NULL,
  `shipping_option` varchar(255) NOT NULL,
  `shipping_fee` decimal(10,2) NOT NULL,
  `payment_mode` varchar(255) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `is_deleted` char(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts_tbl`
--
ALTER TABLE `accounts_tbl`
  ADD PRIMARY KEY (`account_no`);

--
-- Indexes for table `addressbook_tbl`
--
ALTER TABLE `addressbook_tbl`
  ADD PRIMARY KEY (`address_no`);

--
-- Indexes for table `cart_tbl`
--
ALTER TABLE `cart_tbl`
  ADD PRIMARY KEY (`cart_no`);

--
-- Indexes for table `customer_tbl`
--
ALTER TABLE `customer_tbl`
  ADD PRIMARY KEY (`customer_no`),
  ADD KEY `fk_account_no` (`account_no`);

--
-- Indexes for table `demand_tbl`
--
ALTER TABLE `demand_tbl`
  ADD PRIMARY KEY (`demand_no`),
  ADD KEY `fk_product_sku` (`product_sku`);

--
-- Indexes for table `inventory_tbl`
--
ALTER TABLE `inventory_tbl`
  ADD PRIMARY KEY (`product_no`);

--
-- Indexes for table `order_tbl`
--
ALTER TABLE `order_tbl`
  ADD PRIMARY KEY (`item_no`,`transaction_no`),
  ADD KEY `fk_transaction_no` (`transaction_no`);

--
-- Indexes for table `payment_tbl`
--
ALTER TABLE `payment_tbl`
  ADD PRIMARY KEY (`payment_no`),
  ADD KEY `fk_transaction_no` (`transaction_no`);

--
-- Indexes for table `productimage_tbl`
--
ALTER TABLE `productimage_tbl`
  ADD PRIMARY KEY (`image_no`);

--
-- Indexes for table `product_tbl`
--
ALTER TABLE `product_tbl`
  ADD PRIMARY KEY (`product_sku`),
  ADD KEY `fk_product_no` (`product_no`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `shipping_tbl`
--
ALTER TABLE `shipping_tbl`
  ADD PRIMARY KEY (`shipping_no`),
  ADD KEY `fk_transaction_no` (`transaction_no`);

--
-- Indexes for table `stallitems_tbl`
--
ALTER TABLE `stallitems_tbl`
  ADD PRIMARY KEY (`stallitem_no`,`stalltransaction_no`),
  ADD KEY `fk_stalltransaction_no` (`stalltransaction_no`);

--
-- Indexes for table `stalltransaction_tbl`
--
ALTER TABLE `stalltransaction_tbl`
  ADD PRIMARY KEY (`stalltransaction_no`);

--
-- Indexes for table `stocks_tbl`
--
ALTER TABLE `stocks_tbl`
  ADD PRIMARY KEY (`batch_no`),
  ADD KEY `fk_product_sku` (`product_sku`);

--
-- Indexes for table `transaction_tbl`
--
ALTER TABLE `transaction_tbl`
  ADD PRIMARY KEY (`transaction_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts_tbl`
--
ALTER TABLE `accounts_tbl`
  MODIFY `account_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `addressbook_tbl`
--
ALTER TABLE `addressbook_tbl`
  MODIFY `address_no` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `customer_tbl`
--
ALTER TABLE `customer_tbl`
  MODIFY `customer_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `inventory_tbl`
--
ALTER TABLE `inventory_tbl`
  MODIFY `product_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `stalltransaction_tbl`
--
ALTER TABLE `stalltransaction_tbl`
  MODIFY `stalltransaction_no` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `stocks_tbl`
--
ALTER TABLE `stocks_tbl`
  MODIFY `batch_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `transaction_tbl`
--
ALTER TABLE `transaction_tbl`
  MODIFY `transaction_no` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer_tbl`
--
ALTER TABLE `customer_tbl`
  ADD CONSTRAINT `fk_account_no` FOREIGN KEY (`account_no`) REFERENCES `accounts_tbl` (`account_no`);

--
-- Constraints for table `product_tbl`
--
ALTER TABLE `product_tbl`
  ADD CONSTRAINT `fk_product_no` FOREIGN KEY (`product_no`) REFERENCES `inventory_tbl` (`product_no`);

--
-- Constraints for table `shipping_tbl`
--
ALTER TABLE `shipping_tbl`
  ADD CONSTRAINT `fk_transaction_no` FOREIGN KEY (`transaction_no`) REFERENCES `transaction_tbl` (`transaction_no`);

--
-- Constraints for table `stallitems_tbl`
--
ALTER TABLE `stallitems_tbl`
  ADD CONSTRAINT `fk_stalltransaction_no` FOREIGN KEY (`stalltransaction_no`) REFERENCES `stalltransaction_tbl` (`stalltransaction_no`);

--
-- Constraints for table `stocks_tbl`
--
ALTER TABLE `stocks_tbl`
  ADD CONSTRAINT `fk_product_sku` FOREIGN KEY (`product_sku`) REFERENCES `product_tbl` (`product_sku`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
