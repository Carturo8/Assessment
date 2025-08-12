import { db } from '../config/db.js';

// Get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM transactions ORDER BY transaction_id ASC');
        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM transactions WHERE transaction_id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({
            message: 'Transaction retrieved successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new transaction
export const createTransaction = async (req, res) => {
    try {
        const { transaction_id, transaction_date, transaction_amount, transaction_status, transaction_type, client_id, platform_id, invoice_id } = req.body;
        const { rows } = await db.query(
            'INSERT INTO transactions (transaction_id, transaction_date, transaction_amount, transaction_status, transaction_type, client_id, platform_id, invoice_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [transaction_id, transaction_date, transaction_amount, transaction_status, transaction_type, client_id, platform_id, invoice_id]
        );
        res.status(201).json({
            message: 'Transaction created successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update transaction by ID
export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { transaction_date, transaction_amount, transaction_status, transaction_type, client_id, platform_id, invoice_id } = req.body;
        const { rows } = await db.query(
            'UPDATE transactions SET transaction_date = $1, transaction_amount = $2, transaction_status = $3, transaction_type = $4, client_id = $5, platform_id = $6, invoice_id = $7 WHERE transaction_id = $8 RETURNING *',
            [transaction_date, transaction_amount, transaction_status, transaction_type, client_id, platform_id, invoice_id, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({
            message: 'Transaction updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete transaction by ID
export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await db.query('DELETE FROM transactions WHERE transaction_id = $1', [id]);
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
