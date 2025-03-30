import dotenv from 'dotenv';

dotenv.config();

class EnvConfig {
    private static instance: EnvConfig;
    private readonly env: { [key: string]: string | undefined };

    private constructor() {
        this.env = process.env;
    }

    public static getInstance(): EnvConfig {
        if (!EnvConfig.instance) {
            EnvConfig.instance = new EnvConfig();
        }
        return EnvConfig.instance;
    }

    public getPort(): number {
        const port = this.env.PORT;
        if (!port) {
            throw new Error("PORT is not defined in the environment variables.");
        }
        return parseInt(port, 10);
    }

    public getAllowedOrigins(): string[] {
        const allowedOrigins = this.env.ALLOWED_ORIGINS;
        if (!allowedOrigins) {
            throw new Error("ALLOWED_ORIGINS is not defined in the environment variables.");
        }
        return allowedOrigins.split(",");
    }
    public getRpcHostPort(): number {
        const port = this.env.GRPC_PORT_ALBUM_SERVICE;
        if (!port) {
            throw new Error("RPC_PORT is not defined in the environment variables.");
        }
        return parseInt(port, 10);
    }

    public getRpcHost(): string {
        const host = this.env.GRPC_HOST;
        if (!host) {
            throw new Error("RPC_HOST is not defined in the environment variables.");
        }
        return host;
    }
    public getFirebaseKeyPath(): string {
        const path = this.env.FIREBASE_KEY_PATH;
        if (!path) {
            throw new Error("FIREBASE_KEY_PATH is not defined in the environment variables.");
        }
        return path;
    }

    public getFirebaseDatabaseUrl(): string {
        const dbUrl = this.env.FIREBASE_DATABASE_URL;
        if (!dbUrl) {
            throw new Error("FIREBASE_DATABASE_URL is not defined in the environment variables.");
        }
        return dbUrl;
    }

    public getFirebaseProjectId(): string {
        const projectId = this.env.FIREBASE_PROJECT_ID;
        if (!projectId) {
            throw new Error("FIREBASE_PROJECT_ID is not defined in the environment variables.");
        }
        return projectId;
    }

    public getCloudinaryCloudName(): string {
        const cloudName = this.env.CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
            throw new Error("CLOUDINARY_CLOUD_NAME is not defined in the environment variables.");
        }
        return cloudName;
    }

    public getCloudinaryApiKey(): string {
        const cloudApiKey = this.env.CLOUDINARY_API_KEY;
        if (!cloudApiKey) {
            throw new Error("CLOUDINARY_API_KEY is not defined in the environment variables.");
        }
        return cloudApiKey;
    }

    public getCloudinaryApiSecret(): string {
        const cloudApiSecret = this.env.CLOUDINARY_API_SECRET;
        if (!cloudApiSecret) {
            throw new Error("CLOUDINARY_API_SECRET is not defined in the environment variables.");
        }
        return cloudApiSecret;
    }
}

export const envConfig = EnvConfig.getInstance();