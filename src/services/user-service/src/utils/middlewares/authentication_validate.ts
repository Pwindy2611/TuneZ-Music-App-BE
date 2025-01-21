import { NextFunction, Request, Response } from "express";
import { auth } from "../../config/firebase/firebase_config";
import { getUserByEmailService } from "../../services/user_services";
import { validateEmail, validatePassword, validateUsername } from "../base/regex_base";
import { saveSessionTokenToDatabase } from "../base/token_base";
import { authentication, random } from "../helpers/authentication_helper";
import {sendVerificationEmail} from "../base/function_base";

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
        const { email, password } = req.body; 
        
        if (!email || !password) {
            res.status(400).json({ status: 400, success: false, message: 'Please fill all fields' })
            return;
        }

        if (!validatePassword(password)) {
            res.status(400).json({ status: 400, success: false, message: 'Must have >= 8 character, uppercase, lowercase, digit, special character' });
            return; // Ensure the middleware stops execution here.
        }

        if (!validateEmail(email)) {
            res.status(400).json({ status: 400, success: false, message: 'Wrong email format. Example: username@domain.com' });
            return; // Ensure the middleware stops execution here.
        }

        const firebaseUser = auth.getUserByEmail(email);

        if (!(await firebaseUser).emailVerified) {
            res.status(403).json({ success: false, message: "Email not verified" });
            return;
        }
        const existingUser = await getUserByEmailService(email);
        if (!existingUser) {
            res.status(400).json({ status: 400, success: false, message: 'User is not exist' })
            return;
        }

        
        const expectedHash = authentication(existingUser?.authentication?.salt, password);
        if (existingUser?.authentication?.password != expectedHash) {
            res.status(403).json({ status: 403, success: false, message: 'Invalid password' })
            return;
        }

        const salt = random();
        var sessionToken = authentication(salt, existingUser?.userId.toString())

        await saveSessionTokenToDatabase(existingUser.userId, sessionToken);

        res.cookie('TUNEZ-AUTH', existingUser.sessionToken, { domain: 'localhost', path: '/' })
        .status(200)
        .json({ status: 200, success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Error login user:', error.message);
        res.status(500).json({ status: 500, success: false, message: 'Internal Server Error' });
        return;
    }
    next();
};