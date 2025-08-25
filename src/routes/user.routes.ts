
import { Router } from 'express';
import {
  createUser,
  assignGroup,
  listUsers,
  listGroups
} from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkPermission } from '../middlewares/permission.middleware.js';

const router = Router();

router.use(authenticate); 

router.post('/', checkPermission('create_user'), createUser);
router.put('/:id/group', checkPermission('create_user'), assignGroup);
router.get('/', checkPermission('view_users'), listUsers);
router.get('/groups', listGroups); 

export default router;
