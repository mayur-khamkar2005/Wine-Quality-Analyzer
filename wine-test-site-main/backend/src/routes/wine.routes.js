import { Router } from 'express';

import {
  createPrediction,
  getHistory,
} from '../controllers/wine.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { historyQuerySchema } from '../validators/query.validator.js';
import { wineInputSchema } from '../validators/wine.validator.js';

const router = Router();

router.use(protect);
router.post('/predict', validate(wineInputSchema), createPrediction);
router.get('/', validate(historyQuerySchema, 'query'), getHistory);

export const wineRoutes = router;
