-- =======================================================
-- BANK ACCOUNT MANAGEMENT SYSTEM - DATABASE SCRIPT
-- Academic Mini Project: 2nd Year B.Tech CSE
-- Database: MySQL
-- =======================================================

-- 1. Create Database if it does not already exist
CREATE DATABASE IF NOT EXISTS bank_management;
USE bank_management;

-- 2. Drop existing tables if re-running script (Child tables first)
DROP TABLE IF EXISTS TRANSACTION;
DROP TABLE IF EXISTS ACCOUNT;
DROP TABLE IF EXISTS CUSTOMER;

-- 3. Create CUSTOMER Table
CREATE TABLE CUSTOMER (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 4. Create ACCOUNT Table
CREATE TABLE ACCOUNT (
    account_no INT PRIMARY KEY,
    customer_id INT NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Create TRANSACTION Table
CREATE TABLE TRANSACTION (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    account_no INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_no) REFERENCES ACCOUNT(account_no) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =======================================================
-- SAMPLE SEED DATA (For Testing & Presentation Demo)
-- =======================================================

-- Insert Sample Customers
INSERT INTO CUSTOMER (customer_id, name, phone, address) VALUES
(1, 'Rahul Sharma', '9876543210', '42 MG Road, Bangalore'),
(2, 'Priya Patel', '9123456780', '15 Nehru Nagar, Mumbai'),
(3, 'Amit Verma', '9988776655', '7 Civil Lines, New Delhi');

-- Insert Sample Accounts
INSERT INTO ACCOUNT (account_no, customer_id, account_type, balance) VALUES
(1001, 1, 'Savings', 25000.00),
(1002, 2, 'Savings', 15000.00),
(1003, 3, 'Current', 50000.00);

-- Insert Sample Transactions
INSERT INTO TRANSACTION (transaction_id, account_no, type, amount, transaction_date) VALUES
(1, 1001, 'DEPOSIT', 25000.00, '2026-09-01 10:30:00'),
(2, 1002, 'DEPOSIT', 15000.00, '2026-09-02 11:15:00'),
(3, 1003, 'DEPOSIT', 50000.00, '2026-09-03 14:00:00'),
(4, 1001, 'DEPOSIT', 5000.00, '2026-09-10 16:45:00'),
(5, 1001, 'WITHDRAW', 2000.00, '2026-09-15 09:20:00');

-- =======================================================
-- VERIFICATION QUERIES (Check if tables were created properly)
-- =======================================================
-- SELECT * FROM CUSTOMER;
-- SELECT * FROM ACCOUNT;
-- SELECT * FROM TRANSACTION;
