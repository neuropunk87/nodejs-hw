import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from '../controllers/authController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authLimiter } from '../middleware/rateLimitAuth.js';

const router = Router();

router.post(
  '/auth/register',
  authLimiter,
  celebrate(registerUserSchema),
  ctrlWrapper(registerUser),
);
router.post(
  '/auth/login',
  authLimiter,
  celebrate(loginUserSchema),
  ctrlWrapper(loginUser),
);
router.post('/auth/logout', ctrlWrapper(logoutUser));
router.post('/auth/refresh', ctrlWrapper(refreshUserSession));

export default router;
