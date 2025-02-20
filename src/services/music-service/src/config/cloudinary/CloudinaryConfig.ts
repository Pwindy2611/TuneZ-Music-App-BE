import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

class CloudinarySingleton {
    private static instance: CloudinarySingleton;
    public cloudinary;

    private constructor() {
        if (!process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET) {
            throw new Error("Cloudinary environment variables are not set.");
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        } as ConfigOptions);

        this.cloudinary = cloudinary;
    }

    public static getInstance(): CloudinarySingleton {
        if (!CloudinarySingleton.instance) {
            CloudinarySingleton.instance = new CloudinarySingleton();
        }
        return CloudinarySingleton.instance;
    }
}

export const cloudinaryInstance = CloudinarySingleton.getInstance().cloudinary;
