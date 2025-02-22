import {NextFunction, Request, Response} from "express";
import {auth} from '../../config/firebase/FireBaseConfig.js';
import {UserBaseService} from '../../service/UserBaseService.js';
import {validateEmail, validatePassword, validateUsername} from '../base/RegexBase.js';
import {saveSessionTokenToDatabase} from "../base/TokenBase.js";
import {mailService} from '../base/MailBase.js'

class AuthenticationValidate {
    validateRegister = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            res.status(400).json({status: 400, success: false, message: 'Please fill all fields' });
            return;
        }

        if(!validatePassword(password)){
            res.status(400).json({ status: 400, success: false, message: 'Must have >= 8 character, uppercase, lowercase, digit, special character' });
            return;
        }

        if(!validateEmail(email)){
            res.status(400).json({ status: 400, success: false, message: 'Wrong email format. Example: username@domain.com' });
            return;
        }

        if(!validateUsername(username)){
            res.status(400).json({ status: 400, success: false, message: 'Must have >= 3 & <= 16' });
            return;
        }
        const existingUser = await UserBaseService.getUserByEmailService(email);

        if (existingUser) {
            res.status(400).json({status: 400, success: false, message: 'User already exists' });
            return;
        }
        next();
    };

    validateLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { idToken } = req.body;

            const user = await auth.verifyIdToken(idToken);
            
            if (!user) {
                res.status(400).json({status: 400, success: false, message: 'Invalid token' });
                return;
            }
            
            if (!(user.email_verified)) {
                res.status(403).json({ success: false, message: "Email not verified" });
                const link = await auth.generateEmailVerificationLink(user.email ?? "")
                await mailService.sendVerificationEmail(user.email ?? "", link);
                return;
            }

            const existingUser = await UserBaseService.getUserByEmailService(user.email ?? "");

            if (!existingUser && user.firebase.sign_in_provider !== "password") {
                const firebaseUser = await auth.getUser(user.uid);
                await UserBaseService.createUserService({
                    _id: firebaseUser.uid,
                    email: firebaseUser.email ?? "",
                    username: firebaseUser.displayName ?? "",
                    profilePictureUrl: firebaseUser.photoURL ?? "",
                });
                console.log(`Created new user for ${user.email} with provider: ${user.firebase.sign_in_provider}`);
            }
            
            const firebaseToken = await auth.createCustomToken(user.uid);

            await saveSessionTokenToDatabase(user.uid, firebaseToken);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Login successful",
                firebaseToken,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ status: 500, success: false, message:'Error logging in user: ' + error.message});
            } else {
                res.status(500).json({ status: 500, success: false, message: 'Unexpected error occurred' });
            }
        }
        next();
    };
}

export const authValidate = new AuthenticationValidate();
