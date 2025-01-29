import express from 'express';
import {
    getAllUsersApi,
    registerApi,
    sendForgetPasswordApi, sendOtpEmailApi,
    sendVerificationEmailApi, verifyOtpEmailApi
} from '../controllers/users_controller.js';
import { validateLogin, validateRegister } from '../utils/middlewares/authentication_validate.js';

const router = express.Router();

router.get('/getAllUser', getAllUsersApi);
router.post('/register', validateRegister, registerApi);
router.post('/login', validateLogin);
router.post('/sendEmailVerify', sendVerificationEmailApi);
router.post('/sendEmailResetPassword', sendForgetPasswordApi);
router.post('/sendOtpEmail', sendOtpEmailApi);
router.post('/verifyOtp', verifyOtpEmailApi);

export default router;
