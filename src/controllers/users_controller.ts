import { Request, Response, Router } from 'express';
import { auth } from "../config/firebase/firebase_config";
import {createUserService, getAllUsersService, getUserByEmailService} from '../services/user_services';
import { authentication, random } from '../utils/helpers/authentication_helper';
import {sendVerificationEmail} from "../utils/base/function_base";

const router = Router();

export const getAllUsersApi = async (req: Request, res: Response) => {
    try{
        const users = await getAllUsersService();
        res.status(200).json({status: 200, users});
    } catch (error){
        res.status(500).json({status: 500, message: "Error fetching users"})
    }
};

export const registerApi = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        
        await auth.createUser({
            email,
            password,
            displayName: username,
        });
        
        // Gửi email xác minh
        const link = await auth.generateEmailVerificationLink(email);
        await sendVerificationEmail(email, link);
        const firebaseUser = await auth.getUserByEmail(email);
        // Tạo user mới
        const salt = random();
        const newUser = await createUserService({
            userId: firebaseUser.uid,
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
        res.status(500).json({status: 500, success: false, message: error.message });
        return;
    }
};

export const sendVerificationEmailApi = async (req: Request, res: Response) => {
    try {
        const {email} = req.body;
        const link = await auth.generateEmailVerificationLink(email);
        await sendVerificationEmail(email, link);
        
        res.status(200).json({status: 200, message: 'Send Verification Email Successfully'});
    }catch (error) {
        res.status(500).json({status: 500, message: "Error sending email"});
        return;
    }
};
export default router;
