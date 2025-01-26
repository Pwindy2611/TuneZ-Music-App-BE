import express from 'express';
import {
    getAllUsersApi,
    registerApi,
    sendForgetPasswordApi,
    sendVerificationEmailApi
} from '../controllers/users_controller.js';
import { validateLogin, validateRegister } from '../utils/middlewares/authentication_validate.js';

const router = express.Router();

router.get('/all_users', getAllUsersApi);
router.post('/register', validateRegister, registerApi);
router.post('/login', validateLogin);
router.post('/send_email_verify', sendVerificationEmailApi);
router.post('/send_email_reset_password', sendForgetPasswordApi);
export default router;
