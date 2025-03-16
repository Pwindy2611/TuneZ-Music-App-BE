import express from 'express';
import MusicController from '../controller/UserController.js';
import { authValidate } from '../util/middleware/AuthenticationValidate.js';
import {authMiddleware} from "../util/middleware/AuthMiddleware.js";

const router = express.Router();

//Register & Login
router.post('/register', authValidate.validateRegister, MusicController.registerApi);
router.post('/login', authValidate.validateLogin);

//Get Request
router.get('/getAllUser', MusicController.getAllUsersApi);
router.get('/getUserCustomToken', MusicController.getUserCustomTokenApi);
router.get('/getUserInfo', authMiddleware, MusicController.getUserInfoByIdApi);

//Send Email
router.post('/sendEmailVerify', MusicController.sendVerificationEmailApi);
router.post('/sendEmailResetPassword', MusicController.sendForgetPasswordApi);
router.post('/sendOtpEmail', MusicController.sendOtpEmailApi);
router.post('/verifyOtp', MusicController.verifyOtpEmailApi);

//CRUD
router.post('/deleteUser/:userId', MusicController.deleteUserApi);

export default router;
