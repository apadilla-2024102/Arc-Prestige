import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /participants:
 *   get:
 *     tags:
 *       - Participants
 *     summary: Get all participants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of participants
 *       401:
 *         description: Authentication required
 */
router.get('/', authMiddleware, (req, res) => {
    // Obtener todos los participantes
    res.json([]);
});

export default router;
