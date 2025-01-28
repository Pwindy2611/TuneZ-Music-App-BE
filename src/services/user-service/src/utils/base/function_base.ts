import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import {OtpEntry} from "../../interface/otp_entry.js";
import {generateOtp} from "../helpers/authentication_helper.js";
import fs from 'fs';
import path from 'path';

dotenv.config();

const otpStore: Record<string, OtpEntry> = {};

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,  
    },
});
const __dirname = path.dirname(new URL(import.meta.url).pathname);
export async function sendVerificationEmail(email: string, link: string) {
    if (!email) {
        throw new Error('Email address is required for verification email');
    }

    try {
        const emailTemplatePath = path.join(__dirname, '..', '..' , '..' , 'src', 'html', 'verification_email.html');        const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

        const htmlContent = emailTemplate.replace('{{link}}', link);

        const mailOptions = {
            from: process.env.EMAIL_PASS,
            to: email,
            subject: 'Verification Email',
            html: htmlContent,  
        };

        await transporter.sendMail(mailOptions);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Error sending verification email: ${error.message}`);
        } else {
            throw new Error('Unknown error occurred while sending verification email');
        }
    }
}

export async function sendResetPasswordEmail(email: string, link: string) {
    if (!email) {
        throw new Error('Email address is required for password reset email');
    }

    try {
        // Xây dựng đường dẫn đến tệp HTML trong thư mục src/html
        const emailTemplatePath = path.join(__dirname, '..', '..', '..' , 'src', 'html', 'resetpassword_email.html');

        // Đọc tệp HTML từ thư mục src/html
        const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

        // Thay thế {{link}} trong template bằng giá trị thực tế của link
        const htmlContent = emailTemplate.replace('{{link}}', link);

        const mailOptions = {
            from: process.env.EMAIL_PASS, // Đảm bảo rằng bạn đã cấu hình email sender
            to: email,
            subject: 'Password Reset Email',
            html: htmlContent,  // Gửi nội dung HTML đã thay thế
        };

        await transporter.sendMail(mailOptions);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Error sending password reset email: ${error.message}`);
        } else {
            throw new Error('Unknown error occurred while sending password reset email');
        }
    }
}

export async function sendOtpEmail(email: string) {
    if (!email) {
        throw new Error('Email address is required to send OTP');
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    otpStore[email] = { otp, expiresAt };

    try {
        // Xây dựng đường dẫn đến tệp HTML trong thư mục src/html
        const emailTemplatePath = path.join(__dirname, '..', '..', '..', 'src', 'html', 'otp_email.html');

        // Đọc tệp HTML từ thư mục src/html
        const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

        // Thay thế {{otp}} trong template bằng giá trị thực tế của OTP
        const htmlContent = emailTemplate.replace('{{otp}}', otp);

        const mailOptions = {
            from: process.env.EMAIL_PASS,  // Đảm bảo rằng bạn đã cấu hình email sender
            to: email,
            subject: 'Your OTP Code',
            html: htmlContent,  // Gửi nội dung HTML đã thay thế
        };

        await transporter.sendMail(mailOptions);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Error sending OTP email: ${error.message}`);
        } else {
            throw new Error('Unknown error occurred while sending OTP email');
        }
    }
}

export async function verifyOtp(email: string, otp: string) {
    if (!email || !otp) {
        throw new Error('Email and OTP are required');
    }
    const otpEntry = otpStore[email];
    
    if (!otpEntry) {
        throw new Error('OTP not found or already used');
    }

    if (new Date() > otpEntry.expiresAt) {
        delete otpStore[email]; // Xóa OTP hết hạn
        throw new Error('OTP has expired');
    }
    
    if (otpEntry.otp !== otp) {
        throw new Error('Invalid OTP');
    }
    delete otpStore[email];
    return true;
}
