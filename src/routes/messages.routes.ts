import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkPermission } from '../middlewares/permission.middleware.js';
import { listMessages } from '../controllers/messages.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', checkPermission('view_messages'), listMessages);

export default router;


