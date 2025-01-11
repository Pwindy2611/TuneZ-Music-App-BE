import express from 'express';
import { createUser, getAllUsers, } from '../controllers/users_controller';

const router = express.Router();

router.get('/gau', getAllUsers); //gau: getAllUsers
router.post('/cu', createUser); //cu: createUser

export default router;
