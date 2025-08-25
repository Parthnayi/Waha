import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkPermission } from '../middlewares/permission.middleware.js';
import { createDevice, listDevices, sendMessage } from '../controllers/whatsapp.controller.js';

const router = Router();

router.use(authenticate);

router.post('/devices', checkPermission('link_device'), createDevice);
router.get('/devices', checkPermission('view_devices'), listDevices);
router.post('/send', checkPermission('send_message'), sendMessage);

export default router;


