import { db } from '../config/db.js';

// Get all platforms
export const getAllPlatforms = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM platforms ORDER BY platform_id ASC');
        res.status(200).json({
            message: 'Platforms retrieved successfully',
            data: rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get platform by ID
export const getPlatformById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM platforms WHERE platform_id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Platform not found' });
        }
        res.status(200).json({
            message: 'Platform retrieved successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new platform
export const createPlatform = async (req, res) => {
    try {
        const { platform_name } = req.body;
        const { rows } = await db.query(
            'INSERT INTO platforms (platform_name) VALUES ($1) RETURNING *',
            [platform_name]
        );
        res.status(201).json({
            message: 'Platform created successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update platform by ID
export const updatePlatform = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform_name } = req.body;
        const { rows } = await db.query(
            'UPDATE platforms SET platform_name = $1 WHERE platform_id = $2 RETURNING *',
            [platform_name, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Platform not found' });
        }
        res.status(200).json({
            message: 'Platform updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete platform by ID
export const deletePlatform = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await db.query('DELETE FROM platforms WHERE platform_id = $1', [id]);
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Platform not found' });
        }
        res.status(200).json({ message: 'Platform deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
