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
            subject: 'Email Xác Thực',
            text: `Xin chào, hãy nhấn vào liên kết này để xác thực email của bạn: ${link}`,
        };

        // Gửi email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Lỗi khi gửi email:', error);
            } else {
                console.log('Email đã được gửi:', info.response);
            }
        });
    } catch (error) {
        console.error('Lỗi khi tạo hoặc gửi email xác thực:', error);
    }
}