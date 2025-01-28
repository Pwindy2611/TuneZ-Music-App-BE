import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import {OtpEntry} from "../../interface/otp_entry.js";
import {generateOtp} from "../helpers/authentication_helper.js";

dotenv.config();

const otpStore: Record<string, OtpEntry> = {};

const transporter = nodemailer.createTransport({
    service: 'gmail', // Hoặc dịch vụ bạn sử dụng (ví dụ: SendGrid)
    auth: {
        user: process.env.EMAIL_USER, // Địa chỉ email gửi
        pass: process.env.EMAIL_PASS,  // Mật khẩu hoặc app password
    },
});

export async function sendVerificationEmail(email: string, link: string) {
    if (!email) {
        throw new Error('Email address is required for verification email');
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_PASS,
            to: email,
            subject: 'Verification Email',
            text: `Hello, click this link to verify your email: ${link}`,
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
        const mailOptions = {
            from: process.env.EMAIL_PASS,
            to: email,
            subject: 'Password Reset Email',
            text: `Hello, please click this link to reset your password: ${link}`,
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
    otpStore[email] = {otp, expiresAt};
    
    try {
        const mailOptions = {
            from: process.env.EMAIL_PASS,
            to: email,
            subject: 'Your OTP Code',
            text: `Hello, your OTP is: ${otpStore[email].otp}. It is valid for 5 minutes.`,
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
