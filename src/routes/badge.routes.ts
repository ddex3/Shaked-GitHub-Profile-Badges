import { Router } from 'express';
import { badgeHandler } from '../badges/badge.handler';

const router = Router();

router.get('/:type', badgeHandler);

export default router;
