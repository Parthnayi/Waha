import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkPermission } from '../middlewares/permission.middleware.js';
import { listContacts, syncContacts } from '../controllers/contacts.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', checkPermission('view_contacts'), listContacts);
router.get('/sync', checkPermission('sync_contacts'), syncContacts);

export default router;


