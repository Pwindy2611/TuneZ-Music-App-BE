import express from 'express';
import MusicController from '../controller/UserController.js';
import { authValidate } from '../util/middlewares/AuthenticationValidate.js';

const router = express.Router();

//Register & Login
router.post('/register', authValidate.validateRegister, MusicController.registerApi);
router.post('/login', authValidate.validateLogin);

//Get Request
router.get('/getAllUser', MusicController.getAllUsersApi);
router.get('/getUserCustomToken', MusicController.getUserCustomTokenApi);

//Send Email
router.post('/sendEmailVerify', MusicController.sendVerificationEmailApi);
router.post('/sendEmailResetPassword', MusicController.sendForgetPasswordApi);
router.post('/sendOtpEmail', MusicController.sendOtpEmailApi);
router.post('/verifyOtp', MusicController.verifyOtpEmailApi);

export default router;
