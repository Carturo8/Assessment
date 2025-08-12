import express from 'express';
import {
    getAllPlatforms,
    getPlatformById,
    createPlatform,
    updatePlatform,
    deletePlatform
} from '../controllers/platformsController.js';

const router = express.Router();

// 🔵 READ
router.get('/', getAllPlatforms);
router.get('/:id', getPlatformById);

// 🟢 CREATE
router.post('/', createPlatform);

// 🟡 UPDATE
router.put('/:id', updatePlatform);

// 🔴 DELETE
router.delete('/:id', deletePlatform);

export default router;
