import { Router } from 'express';

import {
  getOverview,
  getRecords,
  getUsers,
} from '../controllers/admin.controller.js';
import { USER_ROLES } from '../constants/roles.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { adminPaginationQuerySchema } from '../validators/query.validator.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.ADMIN));
router.get('/overview', getOverview);
router.get('/users', validate(adminPaginationQuerySchema, 'query'), getUsers);
router.get('/records', validate(adminPaginationQuerySchema, 'query'), getRecords);

export const adminRoutes = router;
