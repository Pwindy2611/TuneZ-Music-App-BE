import express from 'express';
import { getAllUsers, register } from '../controllers/users_controller';
import { validateLogin, validateRegister } from '../utils/middlewares/authentication_validate';

const router = express.Router();

router.get('/allusers', getAllUsers);
router.post('/register', validateRegister, register);
router.post('/login', validateLogin);

export default router;
