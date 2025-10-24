import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetEmail,
  resetPassword,
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
router.post(
  '/auth/request-reset-email',
  authLimiter,
  celebrate(requestResetEmailSchema),
  ctrlWrapper(requestResetEmail),
);
router.post(
  '/auth/reset-password',
  authLimiter,
  celebrate(resetPasswordSchema),
  ctrlWrapper(resetPassword),
);

export default router;
