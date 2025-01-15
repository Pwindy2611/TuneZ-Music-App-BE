import express from 'express';
import {getAllUsersApi, registerApi, sendVerificationEmailApi} from '../controllers/users_controller';
import { validateLogin, validateRegister } from '../utils/middlewares/authentication_validate';

const router = express.Router();

router.get('/allusers', getAllUsersApi);
router.post('/register', validateRegister, registerApi);
router.post('/login', validateLogin);
router.post('/send_email_verify', sendVerificationEmailApi);
export default router;
