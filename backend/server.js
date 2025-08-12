import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

// Import routes
import clientsRoutes from "./routes/clientsRoutes.js";
import platformsRoutes from './routes/platformsRoutes.js';
import invoicesRoutes from './routes/invoicesRoutes.js';
import transactionsRoutes from './routes/transactionsRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/clients', clientsRoutes);
app.use('/api/platforms', platformsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/reports', reportsRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
