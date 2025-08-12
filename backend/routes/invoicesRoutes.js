import { Router } from 'express';
import {
    getAllInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice
} from '../controllers/invoicesController.js';

const router = Router();

// 🔵 READ
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);

// 🟢 CREATE
router.post('/', createInvoice);

// 🟡 UPDATE
router.put('/:id', updateInvoice);

// 🔴 DELETE
router.delete('/:id', deleteInvoice);

export default router;
