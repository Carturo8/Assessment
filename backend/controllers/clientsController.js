import { db } from '../config/db.js';

// Get all clients
export const getAllClients = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM clients ORDER BY client_id ASC');
        res.status(200).json({
            message: 'Clients retrieved successfully',
            data: rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get client by ID
export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM clients WHERE client_id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({
            message: 'Client retrieved successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new client
export const createClient = async (req, res) => {
    try {
        const { client_id, client_name, client_address, client_phone, client_email } = req.body;
        const { rows } = await db.query(
            'INSERT INTO clients (client_id, client_name, client_address, client_phone, client_email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [client_id, client_name, client_address, client_phone, client_email]
        );
        res.status(201).json({
            message: 'Client created successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update client by ID
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { client_name, client_address, client_phone, client_email } = req.body;
        const { rows } = await db.query(
            'UPDATE clients SET client_name = $1, client_address = $2, client_phone = $3, client_email = $4 WHERE client_id = $5 RETURNING *',
            [client_name, client_address, client_phone, client_email, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({
            message: 'Client updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete client by ID
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await db.query('DELETE FROM clients WHERE client_id = $1', [id]);
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
