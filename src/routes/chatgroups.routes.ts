import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkPermission } from '../middlewares/permission.middleware.js';
import { listChatGroups, syncChatGroups } from '../controllers/chatgroups.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', checkPermission('view_groups'), listChatGroups);
router.get('/sync', checkPermission('sync_groups'), syncChatGroups);

export default router;


