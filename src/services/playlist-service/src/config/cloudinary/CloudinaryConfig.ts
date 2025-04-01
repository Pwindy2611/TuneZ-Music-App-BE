import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import { envConfig } from '../EnvConfig.js';

class CloudinarySingleton {
    private static instance: CloudinarySingleton;
    public cloudinary;

    private constructor() {
        const config = envConfig.getCloudinaryConfig();
        cloudinary.config({
            cloud_name: config.cloud_name,
            api_key: config.api_key,
            api_secret: config.api_secret,
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
