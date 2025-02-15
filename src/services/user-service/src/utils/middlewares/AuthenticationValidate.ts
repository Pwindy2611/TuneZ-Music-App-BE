import { NextFunction, Request, Response } from "express";
import { auth } from '../../config/firebase/FireBaseConfig.js';
import { getUserByEmailService } from '../../services/UserBaseService.js';
import { validateEmail, validatePassword, validateUsername } from '../base/RegexBase.js';
import { saveSessionTokenToDatabase } from '../base/TokenBase.js';
import { authentication, random } from '../helpers/AuthenticationHelper.js';

export const validateRegister = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        res.status(400).json({status: 400, success: false, message: 'Please fill all fields' });
        return; // Ensure the middleware stops execution here.
    }

    if(!validatePassword(password)){
        res.status(400).json({ status: 400, success: false, message: 'Must have >= 8 character, uppercase, lowercase, digit, special character' });
        return; // Ensure the middleware stops execution here.
    }

    if(!validateEmail(email)){
        res.status(400).json({ status: 400, success: false, message: 'Wrong email format. Example: username@domain.com' });
        return; // Ensure the middleware stops execution here.
    }

    if(!validateUsername(username)){
        res.status(400).json({ status: 400, success: false, message: 'Must have >= 3 & <= 16' });
        return; // Ensure the middleware stops execution here.
    }
    // Kiểm tra xem user đã tồn tại hay chưa
    const existingUser = await getUserByEmailService(email);

    if (existingUser) {
        res.status(400).json({status: 400, success: false, message: 'User already exists' });
        return;
    }
    next();
};

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;

        const user = await auth.verifyIdToken(token);
        
        if (!user) {
            res.status(400).json({status: 400, success: false, message: 'Invalid token' });
            return;
        }

        if (!(user.email_verified)) {
            res.status(403).json({ success: false, message: "Email not verified" });
            return;
        }

        const existingUser = await getUserByEmailService(user.email ?? "");
        
        if (!existingUser) {
            res.status(400).json({ status: 400, success: false, message: 'User does not exist' });
            return;
        }

        const firebaseToken = await auth.createCustomToken(existingUser.userId.toString());
        
        res.status(200).json({
            status: 200,
            success: true,
            message: "Login successful",
            firebaseToken, 
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error logging in user:', error.message);
            res.status(500).json({ status: 500, success: false, message: 'Internal Server Error' });
        } else {
            console.error('Unexpected error during login');
            res.status(500).json({ status: 500, success: false, message: 'Unexpected error occurred' });
        }
    }
    next();
};
