import {NextFunction, Request, Response} from 'express';
import { auth } from "../config/firebase/FireBaseConfig.js";
import {UserBaseService} from '../services/UserBaseService.js';
import { authentication, random } from '../utils/helpers/AuthenticationHelper.js';
import {mailService} from "../utils/base/MailBase.js";

class UserController {
    getAllUsersApi = async (_req: Request, res: Response) => {
        try {
            const users = await UserBaseService.getAllUsersService();
            res.status(200).json({ status: 200, users });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ status: 500, message: error.message });
            } else {
                res.status(500).json({ status: 500, message: 'Error fetching users' });
            }
        }
    };

    registerApi = async (req: Request, res: Response) => {
        try {
            const { email, password, username } = req.body;

            await auth.createUser({
                email,
                password,
                displayName: username,
            });

            // Gửi email xác minh
            const link = await auth.generateEmailVerificationLink(email);
            await mailService.sendVerificationEmail(email, link);
            const firebaseUser = await auth.getUserByEmail(email);

            // Tạo user mới
            const salt = random();
            const newUser = await UserBaseService.createUserService({
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error registering user:', error.message);
                res.status(500).json({ status: 500, success: false, message: error.message });
            } else {
                res.status(500).json({ status: 500, success: false, message: 'Error registering user' });
            }
        }
    };
    //## Social Component ##//

    // register/login GOOGLE 
    loginWithGoogleApi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { idToken } = req.body;

            if (!idToken) {
                res.status(400).json({ error: "Thiếu idToken" });
                return;
            }

            const userData = await UserBaseService.loginUserGoogle(idToken);

            res.status(200).json(userData);
        } catch (error: any) {

            let statusCode = 500;
            let errorMessage = "Lỗi máy chủ nội bộ";

            if (error.message.includes("Token không hợp lệ")) {
                statusCode = 401;
                errorMessage = "Token Google không hợp lệ";
            } else if (error.message.includes("Thiếu idToken")) {
                statusCode = 400;
                errorMessage = "Thiếu idToken";
            } else if (error.message.includes("Lỗi xác thực với Supabase")) {
                statusCode = 401;
                errorMessage = "Lỗi xác thực với Supabase";
            }

            res.status(statusCode).json({ error: errorMessage });
        }
    };

    // register/login GOOGLE 

    // register/login Facebook 

    // register/login Facebook 

    //## Social Component ##//


    sendVerificationEmailApi = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const link = await auth.generateEmailVerificationLink(email);
            await mailService.sendVerificationEmail(email, link);

            res.status(200).json({ status: 200, message: 'Send Verification Email Successfully' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ status: 500, message: error.message });
            } else {
                res.status(500).json({ status: 500, message: 'Error sending email' });
            }
        }
    };

    sendForgetPasswordApi = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const link = await auth.generatePasswordResetLink(email);
            await mailService.sendResetPasswordEmail(email, link);

            res.status(200).json({ status: 200, message: 'Send Reset Password Email Successfully' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ status: 500, message: error.message });
            } else {
                res.status(500).json({ status: 500, message: 'Error sending forget password' });
            }
        }
    };

    sendOtpEmailApi = async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ status: 400, success: false, message: 'Email is required' });
            return;
        }

        try {
            // Gửi OTP qua email
            await mailService.sendOtpEmail(email);

            // Phản hồi nếu thành công
            res.status(200).json({
                status: 200,
                success: true,
                message: 'OTP has been sent successfully',
            });
            return;
        } catch (error: unknown) {
            // Xử lý lỗi nếu có vấn đề
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error occurred';

            res.status(500).json({
                status: 500,
                success: false,
                message: `Failed to send OTP: ${errorMessage}`,
            });
            return;
        }
    }

    verifyOtpEmailApi = async (req: Request, res: Response) => {
        const { email , otp } = req.body;


        if (!email || !otp) {
            res.status(400).json({status: 400, success: false, message: 'Email & Otp is required' });
            return;
        }

        try {
            await mailService.verifyOtp(email, otp);
            res.status(200).json({
                status: 200,
                success: true,
                message: 'OTP has been verified',
            });
            return;
        }
        catch (error: unknown) {
            // Xử lý lỗi nếu có vấn đề
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error occurred';

            res.status(500).json({
                status: 500,
                success: false,
                message: `Failed to verify OTP: ${errorMessage}`,
            });
            return;
        }
    }
}

export default new UserController();