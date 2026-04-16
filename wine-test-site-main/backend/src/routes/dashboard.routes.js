import { Router } from 'express';

import { getSummary } from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/summary', getSummary);

export const dashboardRoutes = router;
