import { Router } from 'express';
import {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from '../controllers/transactionsController.js';

const router = Router();

// 🔵 READ
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);

// 🟢 CREATE
router.post('/', createTransaction);

// 🟡 UPDATE
router.put('/:id', updateTransaction);

// 🔴 DELETE
router.delete('/:id', deleteTransaction);

export default router;
