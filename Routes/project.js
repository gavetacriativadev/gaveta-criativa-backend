import {project_routes} from '../Controllers/index.js';
import { Router } from 'express';

let router = Router();

router.get(
    '/',
    project_routes.get_standard_message
);

router.get(
    '/project/:Id',
    project_routes.get_project
);

router.post(
    '/project',
    project_routes.create_project
);

router.get(
    '/projects/agent',
    project_routes.get_project_by_agent
);

router.get(
    '/all_projects',
    project_routes.get_projects
);

router.get(
	'/approved_projects',
	project_routes.get_approved_projects
);

router.delete(
    '/project',
    project_routes.delete_project
);
router.patch(
    '/project',
    project_routes.put_project
);

export default router;
