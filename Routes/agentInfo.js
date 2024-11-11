import { agentInfo_routes } from '../Controllers/index.js'
import { Router } from 'express';

let router = Router();

router.get(
    '/',
    agentInfo_routes.get_standard_message
);

router.get(
    '/agent',
    agentInfo_routes.get_agentInfo
);

router.post(
    '/agentInfo',
    agentInfo_routes.create_agentInfo
);

router.get(
    '/agent/user',
    agentInfo_routes.get_agentInfo_by_email
);

router.get(
    '/all_agent',
    agentInfo_routes.get_agentInfos
);

router.get(
  '/approved_agents',
  agentInfo_routes.get_approved_agents
);

router.post(
  '/agent/login',
  agentInfo_routes.login_user
);

router.get(
  '/agent/recoverpwd',
  agentInfo_routes.send_pwd
);

router.delete(
    '/agent',
    agentInfo_routes.delete_agentInfo
);
router.patch(
    '/agent',
    agentInfo_routes.put_agentInfo
);

export default router;
