import express from 'express';
import { getSummary, getTrends } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/trends', getTrends);

export default router;
