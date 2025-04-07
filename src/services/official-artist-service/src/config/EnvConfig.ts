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
        const port = this.env.GRPC_PORT_OFFICIAL_ARTIST_SERVICE;
        if (!port) {
            throw new Error("GRPC_PORT_OFFICIAL_ARTIST_SERVICE is not defined in the environment variables.");
        }
        return parseInt(port, 10);
    }

    public getRpcHost(): string {
        const host = this.env.GRPC_HOST;
        if (!host) {
            throw new Error("GRPC_HOST is not defined in the environment variables.");
        }
        return host;
    }

    public getRpcMusicServicePort(): number {
        const port = this.env.GRPC_PORT_MUSIC_SERVICE;
        if (!port) {
            throw new Error("GRPC_PORT_MUSIC_SERVICE is not defined in the environment variables.");
        }
        return parseInt(port, 10);
    }

    public getRpcAlbumServicePort(): number {
        const port = this.env.GRPC_PORT_ALBUM_SERVICE;
        if (!port) {
            throw new Error("GRPC_PORT_ALBUM_SERVICE is not defined in the environment variables.");
        }
        return parseInt(port, 10);
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

    public getCloudinaryConfig() {
        const cloudName = this.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = this.env.CLOUDINARY_API_KEY;
        const apiSecret = this.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            throw new Error("Cloudinary environment variables are not set.");
        }

        return {
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        };
    }

    public getRedisUrl(): string {
        const url = this.env.REDIS_URL;
        if (!url) {
            throw new Error("REDIS_URL is not defined in the environment variables.");
        }
        return url;
    }
}

export const envConfig = EnvConfig.getInstance(); 