import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { OtpEntry } from "../../interface/IOtpEntry.js";
import { generateOtp } from "../helpers/AuthenticationHelper.js";
import fs from "fs";
import path from "path";

dotenv.config();

class MailBase {
    private transporter;
    private otpStore: Record<string, OtpEntry> = {};
    private __dirname = path.dirname(new URL(import.meta.url).pathname);

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    private readEmailTemplate(templateName: string): string {
        try {
            const emailTemplatePath = path.join(this.__dirname, "..", "..", "..", "src", "html", `${templateName}.html`);
            return fs.readFileSync(emailTemplatePath, "utf-8");
        } catch (error) {
            throw new Error(`Error reading email template: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async sendVerificationEmail(email: string, link: string) {
        if (!email) throw new Error("Email address is required for verification email");

        try {
            const emailTemplate = this.readEmailTemplate("verification_email");
            const htmlContent = emailTemplate.replace("{{link}}", link);

            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verification Email",
                html: htmlContent,
            });
        } catch (error: unknown) {
            throw new Error(`Error sending verification email: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async sendResetPasswordEmail(email: string, link: string) {
        if (!email) throw new Error("Email address is required for password reset email");

        try {
            const emailTemplate = this.readEmailTemplate("resetpassword_email");
            const htmlContent = emailTemplate.replace("{{link}}", link);

            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset Email",
                html: htmlContent,
            });
        } catch (error: unknown) {
            throw new Error(`Error sending password reset email: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async sendOtpEmail(email: string) {
        if (!email) throw new Error("Email address is required to send OTP");

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        this.otpStore[email] = { otp, expiresAt };

        try {
            const emailTemplate = this.readEmailTemplate("otp_email");
            const htmlContent = emailTemplate.replace("{{otp}}", otp);

            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: `${otp} is your OTP Code`,
                html: htmlContent,
            });
        } catch (error: unknown) {
            throw new Error(`Error sending OTP email: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async verifyOtp(email: string, otp: string) {
        if (!email || !otp) throw new Error("Email and OTP are required");

        const otpEntry = this.otpStore[email];
        if (!otpEntry) throw new Error("OTP not found or already used");

        if (new Date() > otpEntry.expiresAt) {
            delete this.otpStore[email]; // Xóa OTP hết hạn
            throw new Error("OTP has expired");
        }

        if (otpEntry.otp !== otp) throw new Error("Invalid OTP");

        delete this.otpStore[email];
        return true;
    }
}
export const mailService = new MailBase();
