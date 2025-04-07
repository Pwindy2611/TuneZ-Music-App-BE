import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import { envConfig } from "../EnvConfig.js";

class CloudinarySingleton {
    private static instance: CloudinarySingleton;
    public cloudinary;

    private constructor() {
        cloudinary.config(envConfig.getCloudinaryConfig() as ConfigOptions);
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
