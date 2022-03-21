import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
const router = new Router();

router.route('/login').post(AuthController.login);

router.route('/signup').post(AuthController.signup);

router.route('/forgot-password').post(AuthController.forgotPassword);

router.route('/reset-password').post(AuthController.resetPassword);

export default router;
