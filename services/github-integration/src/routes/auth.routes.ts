import { Router } from 'express';
import { callback, logout } from '../controllers/auth.controller';
import { validateAuthCode } from '../middlewares/validateAuth';
import { authLimiter } from '../middlewares/rateLimit';

const router = Router();

router.get('/callback', authLimiter, validateAuthCode, callback);

router.post('/logout', logout);

export default router;