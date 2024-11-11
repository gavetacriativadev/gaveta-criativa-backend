import user_routes from './user.js';
import agentInfo_routes from "./agentInfo.js";
import project_routes from "./project.js";
import gaveta_routes  from './gaveta.js'

import { Router } from 'express';

const router = Router();

router.use(user_routes);
router.use(agentInfo_routes);
router.use(project_routes);
router.use(gaveta_routes);

export default router;
