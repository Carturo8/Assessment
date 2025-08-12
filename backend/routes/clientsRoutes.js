import { Router } from 'express';
import {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
} from '../controllers/clientsController.js';

const router = Router();

// 🔵 READ
router.get('/', getAllClients);
router.get('/:id', getClientById);

// 🟢 CREATE
router.post('/', createClient);

// 🟡 UPDATE
router.put('/:id', updateClient);

// 🔴 DELETE
router.delete('/:id', deleteClient);

export default router;
