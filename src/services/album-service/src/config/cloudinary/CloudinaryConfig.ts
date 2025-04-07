import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import * as dotenv from "dotenv";
import {envConfig} from "../EnvConfig.js";

dotenv.config();

class CloudinarySingleton {
    private static instance: CloudinarySingleton;
    private _cloudinaryCloudName: string;
    private _cloudinaryApiKey: string;
    private _cloudinaryApiSecret: string;
    public cloudinary;

    private constructor() {
        this._cloudinaryCloudName = envConfig.getCloudinaryCloudName();
        this._cloudinaryApiKey = envConfig.getCloudinaryApiKey();
        this._cloudinaryApiSecret = envConfig.getCloudinaryApiSecret();
        if (!this._cloudinaryCloudName || !this._cloudinaryApiKey || !this._cloudinaryApiSecret) {
            throw new Error("Cloudinary environment variables are not set.");
        }

        cloudinary.config({
            cloud_name: this._cloudinaryCloudName,
            api_key: this._cloudinaryApiKey,
            api_secret: this._cloudinaryApiSecret,
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
