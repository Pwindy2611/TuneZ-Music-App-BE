import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Hoặc dịch vụ bạn sử dụng (ví dụ: SendGrid)
    auth: {
        user: process.env.EMAIL_USER, // Địa chỉ email gửi
        pass: process.env.EMAIL_PASS,  // Mật khẩu hoặc app password
    },
});

export async function sendVerificationEmail(email: string, link: string) {
    try {

        // Cấu hình email
        const mailOptions = {
            from: process.env.EMAIL_PASS,
            to: email,
            subject: 'Verification Email',
            text: `Hello, click this link to verify your email: ${link}`,
        };

        // Gửi email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email has been sent:', info.response);
            }
        });
    } catch (error) {
        console.error('Error creating or sending authentication email:', error);
    }
}

export async function sendResetPasswordEmail(email: string, link: string) {
    try {

        // Cấu hình email
        const mailOptions = {
            from: process.env.EMAIL_PASS,
            to: email,
            subject: 'Password Reset Email',
            text: `Hello, please click this link to reset your password: ${link}`,
        };

        // Gửi email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email has been sent:', info.response);
            }
        });
    } catch (error) {
        console.error('Error creating or sending authentication email:', error);
    }
}