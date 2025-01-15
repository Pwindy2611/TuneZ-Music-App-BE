import { Request, Response, Router } from 'express';
import { createUserService, getAllUsersService, getUserByEmailService } from '../services/user_services';
import { authentication, random } from '../utils/helpers/authentication_helper';

const router = Router();

export const getAllUsers = async (req: Request, res: Response) => {
    try{
        const users = await getAllUsersService();
        res.status(200).json({status: 200, users});
    } catch (error){
        res.status(500).json({status: 500, message: "Error fetching users"})
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;

        // Tạo user mới
        const salt = random();
        const newUser = await createUserService({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        // Trả về response thành công
        res.status(201).json({
            status: 201,
            success: true,
            message: 'Register successfully',
            user: newUser,
        });
    } catch (error: any) {
        console.error('Error registering user:', error.message);
        res.status(500).json({status: 500, success: false, message: 'Internal Server Error' });
        return;
    }
};

export default router;
