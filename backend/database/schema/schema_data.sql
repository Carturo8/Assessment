-- Create a schema for ExpertSoft Client

-- Drop database if exists (for development purposes)
DROP DATABASE IF EXISTS pd_carlos_rojas_gosling;

-- Create database
CREATE DATABASE pd_carlos_rojas_gosling;

-- Use database
\c pd_carlos_rojas_gosling;

-- Drop tables if they exist (for development purposes)
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS platforms CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;

-- Clients table
CREATE TABLE clients
(
    client_id SERIAL PRIMARY KEY,
    client_name  VARCHAR(100) NOT NULL,
    client_address VARCHAR(255) NOT NULL,
    client_phone VARCHAR(100)  NOT NULL,
    client_email VARCHAR(150) NOT NULL UNIQUE
);

-- Platforms table
CREATE TABLE platforms
(
    platform_id SERIAL PRIMARY KEY,
    platform_name VARCHAR(100) NOT NULL
);

-- Invoices table
CREATE TABLE invoices
(
    invoice_id VARCHAR(50) PRIMARY KEY,
    invoice_date TEXT NOT NULL,
    invoiced_amount NUMERIC(10,2),
    amount_paid NUMERIC(10,2),
    client_id INTEGER REFERENCES clients(client_id) NOT NULL
);

-- Transactions table
CREATE TABLE transactions
(
    transaction_id VARCHAR(50) PRIMARY KEY,
    transaction_date TIMESTAMP NOT NULL,
    transaction_amount NUMERIC(10,2) NOT NULL,
    transaction_status VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(100) NOT NULL,
    client_id INTEGER REFERENCES clients(client_id) NOT NULL,
    platform_id INTEGER REFERENCES platforms(platform_id) NOT NULL,
    invoice_id VARCHAR(50) REFERENCES invoices(invoice_id) NOT NULL
);