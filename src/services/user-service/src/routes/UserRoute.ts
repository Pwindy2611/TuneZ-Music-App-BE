import express from 'express';
import MusicController from '../controllers/UserController.js';
import { authValidate } from '../utils/middlewares/AuthenticationValidate.js';

const router = express.Router();

//Register & Login
router.post('/register', authValidate.validateRegister, MusicController.registerApi);
router.post('/login', authValidate.validateLogin);
router.post('/login/google', MusicController.loginWithGoogleApi);

//Get Request
router.get('/getAllUser', MusicController.getAllUsersApi);

//Send Email
router.post('/sendEmailVerify', MusicController.sendVerificationEmailApi);
router.post('/sendEmailResetPassword', MusicController.sendForgetPasswordApi);
router.post('/sendOtpEmail', MusicController.sendOtpEmailApi);
router.post('/verifyOtp', MusicController.verifyOtpEmailApi);

export default router;
