import { Router } from 'express';
import { gaveta_routes } from '../Controllers/index.js'

let router = Router();

router.get(
  '/gaveta/gallery',
  gaveta_routes.get_gallery
);

export default router;
