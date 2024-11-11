import {user_routes} from '../Controllers/index.js';
import { Router } from 'express';

let router = Router();

router.get(
    '/',
    user_routes.get_standard_message
);

router.get(
    '/user',
    user_routes.get_user
);

router.post(
    '/user',
    user_routes.create_user
);

router.post(
    '/user/login',
    user_routes.login_user
);

router.get(
    '/user/email',
    user_routes.get_user_by_email
);

router.get(
    '/user/recoverpwd',
    user_routes.send_pwd
);

router.get(
    '/user_login',
    user_routes.get_user_by_login
);

router.get(
    '/all_users',
    user_routes.get_users
);

router.delete(
    '/user',
    user_routes.delete_user
);
router.patch(
    '/user',
    user_routes.put_user
);

export default router;
