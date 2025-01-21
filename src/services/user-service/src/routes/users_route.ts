import express from 'express';
import {
    getAllUsersApi,
    registerApi,
    sendForgetPasswordApi,
    sendVerificationEmailApi
} from '../controllers/users_controller';
import { validateLogin, validateRegister } from '../utils/middlewares/authentication_validate';

const router = express.Router();

router.get('/allusers', getAllUsersApi);
router.post('/register', validateRegister, registerApi);
router.post('/login', validateLogin);
router.post('/send_email_verify', sendVerificationEmailApi);
router.post('/send_email_reset_password', sendForgetPasswordApi);
export default router;
