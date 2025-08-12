import { db } from '../config/db.js';

// 1) Total pay for clients
export const getClientsTotalPaid = async (_req, res) => {
    try {
        const {rows} = await db.query(
            `
                SELECT c.client_id,
                       c.client_name,
                       COALESCE(SUM(t.transaction_amount), 0) AS total_paid
                FROM clients c
                         LEFT JOIN invoices f ON c.client_id = f.client_id
                         LEFT JOIN transactions t ON f.invoice_id = t.invoice_id
                GROUP BY c.client_id, c.client_name
                ORDER BY total_paid DESC
            `
        );
        res.status(200).json({message: 'Clients total paid', data: rows});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// 2) Invoices with pending balance
export const getInvoicesWithPendingBalance = async (_req, res) => {
    try {
        const {rows} = await db.query(
            `
                SELECT f.invoice_id,
                       c.client_name                                               AS client,
                       f.invoiced_amount                                            AS total,
                       COALESCE(SUM(t.transaction_amount), 0)                      AS paid,
                       (f.invoiced_amount - COALESCE(SUM(t.transaction_amount), 0)) AS pending_balance
                FROM invoices f
                         JOIN clients c ON f.client_id = c.client_id
                         LEFT JOIN transactions t ON f.invoice_id = t.invoice_id
                GROUP BY f.invoice_id, c.client_name, f.invoiced_amount
                HAVING (f.invoiced_amount - COALESCE(SUM(t.transaction_amount), 0)) > 0
                ORDER BY pending_balance DESC
            `
        );
        res.status(200).json({message: 'Invoices with pending balance', data: rows});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// 3) List of transactions by platform
export const getTransactionsByPlatform = async (req, res) => {
    try {
        const platform = String(req.query.platform || '').trim();
        if (!platform) {
            return res.status(400).json({error: 'Query param "platform" is required'});
        }

        const {rows} = await db.query(
            `
                SELECT t.transaction_id,
                       p.platform_name AS platform,
                       t.transaction_amount,
                       t.transaction_date,
                       c.client_name   AS client,
                       f.invoice_id
                FROM transactions t
                         JOIN invoices f ON t.invoice_id = f.invoice_id
                         JOIN clients c ON f.client_id = c.client_id
                         JOIN platforms p ON t.platform_id = p.platform_id
                WHERE p.platform_name = $1
                ORDER BY t.transaction_date DESC
            `,
            [platform]
        );
        res.status(200).json({message: 'Transactions by platform', data: rows});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};