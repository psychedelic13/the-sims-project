-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 23, 2018 at 02:54 AM
-- Server version: 5.7.23-0ubuntu0.16.04.1
-- PHP Version: 7.0.32-0ubuntu0.16.04.1

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
(1, 'blairwaldorf', '$2a$10$Nsu.UojRxZSq/UvudEP16erciWF56XH6XLe6jM/hbktSYGvnP13sW', 'Waldorf', 'Blair', 'superadmin', 1);

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
  `email_address` varchar(30) NOT NULL,
  `successful_trans` int(11) NOT NULL,
  `cancelled_trans` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_tbl`
--

INSERT INTO `customer_tbl` (`customer_no`, `account_no`, `last_name`, `first_name`, `email_address`, `successful_trans`, `cancelled_trans`) VALUES
(1, 2, 'waldorf', 'Blair', 'waldorfdesigns@gossipgirl.com', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `demand_tbl`
--

CREATE TABLE `demand_tbl` (
  `demand_no` int(11) NOT NULL,
  `product_sku` varchar(255) NOT NULL,
  `timeframe_start` date NOT NULL,
  `timeframe_end` date NOT NULL,
  `item_sold` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `expenses_tbl`
--

CREATE TABLE `expenses_tbl` (
  `expense_no` int(11) NOT NULL,
  `expense_biller` varchar(30) NOT NULL,
  `expense_date` date NOT NULL,
  `expense_desc` longtext NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `is_deleted` char(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `expenses_tbl`
--

INSERT INTO `expenses_tbl` (`expense_no`, `expense_biller`, `expense_date`, `expense_desc`, `amount`, `is_deleted`) VALUES
(1, 'MERALCO', '2018-08-15', 'FOR THE MONTH OF JULY', '1000.00', '0');

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
  `stock_left` int(11) NOT NULL,
  `is_phased_out` char(1) NOT NULL DEFAULT '0',
  `is_deleted` char(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inventory_tbl`
--

INSERT INTO `inventory_tbl` (`product_no`, `product_slug`, `product_category`, `product_origin`, `product_name`, `product_price`, `product_cog`, `product_desc`, `stock_left`, `is_phased_out`, `is_deleted`) VALUES
(1, 'MVHPGR', 'Movies', 'Harry Potter', 'Gryffindor', '1300.00', '0.00', 'ff', 0, '0', '1'),
(2, 'MVHPRC', 'Movies', 'Harry Potter', 'Ravenclaw Inspired Jacket', '1200.00', '0.00', 'Raveeenclaawwww', 0, '0', '0'),
(3, 'MVMUDP', 'Movies', 'Marvel Universe', 'Deadpool Inspired Jacket', '1300.00', '0.00', 'Ryan Reynolds', 0, '0', '0'),
(4, 'MVHPHP', 'Movies', 'Harry Potter', 'Hufflepuff Inspired Jacket', '1200.00', '0.00', 'Ugh', 0, '0', '0'),
(5, 'MVRDCH', 'Movies', 'Riverdale', 'Cheerleading Inspired Clothing', '1200.00', '0.00', 'From CW&#x27;s Riverdale', 0, '0', '0');

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

--
-- Dumping data for table `payment_tbl`
--

INSERT INTO `payment_tbl` (`payment_no`, `transaction_no`, `payors_name`, `payment_date`, `payment_mode`, `amount`, `is_deleted`) VALUES
(7, 1, 'Ryan Reynolds', '2018-08-17', 'bdo', '1200.00', '0');

-- --------------------------------------------------------

--
-- Table structure for table `productimage_tbl`
--

CREATE TABLE `productimage_tbl` (
  `img_no` int(11) NOT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

--
-- Dumping data for table `shipping_tbl`
--

INSERT INTO `shipping_tbl` (`shipping_no`, `transaction_no`, `courier`, `release_date`, `shipping_notes`, `is_deleted`) VALUES
(1, 1, 'NinjaVan', '2018-08-18', 'TRACKING #123412421', '0');

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
  `product_sku` varchar(8) NOT NULL,
  `production_date` int(11) NOT NULL,
  `batch_cog` decimal(10,2) NOT NULL,
  `shelf_location` varchar(8) NOT NULL,
  `initial_stock` int(11) NOT NULL,
  `stock_left` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
-- Dumping data for table `transaction_tbl`
--

INSERT INTO `transaction_tbl` (`transaction_no`, `customer_no`, `transaction_date`, `status`, `payment_deadline`, `shipping_option`, `shipping_fee`, `payment_mode`, `total_amount`, `is_deleted`) VALUES
(1, 1, '2018-08-15', '2', '2018-08-18', 'provincial', '120.00', 'bdo', '1200.00', '0');

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
  ADD PRIMARY KEY (`customer_no`);

--
-- Indexes for table `demand_tbl`
--
ALTER TABLE `demand_tbl`
  ADD PRIMARY KEY (`demand_no`),
  ADD KEY `fk_product_sku` (`product_sku`);

--
-- Indexes for table `expenses_tbl`
--
ALTER TABLE `expenses_tbl`
  ADD PRIMARY KEY (`expense_no`);

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
  ADD PRIMARY KEY (`img_no`);

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
-- Constraints for dumped tables
--

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
