import { db } from '../config/db.js';

// Get all invoices
export const getAllInvoices = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM invoices ORDER BY invoice_id ASC');
        res.status(200).json({
            message: 'Invoices retrieved successfully',
            data: rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM invoices WHERE invoice_id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json({
            message: 'Invoice retrieved successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new invoice
export const createInvoice = async (req, res) => {
    try {
        const { invoice_id, invoice_date, invoiced_amount, amount_paid, client_id } = req.body;
        const { rows } = await db.query(
            'INSERT INTO invoices (invoice_id, invoice_date, invoiced_amount, amount_paid, client_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [invoice_id, invoice_date, invoiced_amount, amount_paid, client_id]
        );
        res.status(201).json({
            message: 'Invoice created successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update invoice by ID
export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { invoice_date, invoiced_amount, amount_paid, client_id } = req.body;
        const { rows } = await db.query(
            'UPDATE invoices SET invoice_date = $1, invoiced_amount = $2, amount_paid = $3, client_id = $4 WHERE invoice_id = $5 RETURNING *',
            [invoice_date, invoiced_amount, amount_paid, client_id, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json({
            message: 'Invoice updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete invoice by ID
export const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await db.query('DELETE FROM invoices WHERE invoice_id = $1', [id]);
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
