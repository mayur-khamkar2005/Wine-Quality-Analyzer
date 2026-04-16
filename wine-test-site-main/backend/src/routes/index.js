import { Router } from 'express';

import { adminRoutes } from './admin.routes.js';
import { authRoutes } from './auth.routes.js';
import { dashboardRoutes } from './dashboard.routes.js';
import { wineRoutes } from './wine.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/wines', wineRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);

export const apiRouter = router;
