import { Router } from 'express';
import {
    getClientsTotalPaid,
    getInvoicesWithPendingBalance,
    getTransactionsByPlatform
} from '../controllers/reportsController.js';

const router = Router();

// 🔵 READ
router.get('/clients/total-paid', getClientsTotalPaid);
router.get('/invoices/pending-balance', getInvoicesWithPendingBalance);
router.get('/transactions/by-platform', getTransactionsByPlatform);

export default router;
