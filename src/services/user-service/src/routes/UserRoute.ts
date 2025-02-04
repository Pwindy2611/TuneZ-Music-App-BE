import express from 'express';
import {
    getAllUsersApi,
    registerApi,
    loginWithGoogleApi,
    sendForgetPasswordApi, sendOtpEmailApi,
    sendVerificationEmailApi, verifyOtpEmailApi
} from '../controllers/UserController.js';
import { validateLogin, validateRegister } from '../utils/middlewares/AuthenticationValidate.js';

const router = express.Router();

router.get('/getAllUser', getAllUsersApi);
router.post('/register', validateRegister, registerApi);
router.post('/login/google', loginWithGoogleApi);
router.post('/login', validateLogin);
router.post('/sendEmailVerify', sendVerificationEmailApi);
router.post('/sendEmailResetPassword', sendForgetPasswordApi);
router.post('/sendOtpEmail', sendOtpEmailApi);
router.post('/verifyOtp', verifyOtpEmailApi);

export default router;
