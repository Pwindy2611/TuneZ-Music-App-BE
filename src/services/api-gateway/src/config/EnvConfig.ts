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

    public getServiceUrls(): { [key: string]: string } {
        const urls = {
            users: this.env.USER_SERVICE_URL,
            offartist: this.env.OFFICIAL_ARTIST_SERVICE_URL,
            musics: this.env.MUSIC_SERVICE_URL,
            history: this.env.HISTORY_SERVICE_URL,
            love: this.env.LOVE_SERVICE_URL,
            follow: this.env.FOLLOW_SERVICE_URL,
            playlists: this.env.PLAYLIST_SERVICE_URL,
            albums: this.env.ALBUM_SERVICE_URL,
            subscriptions: this.env.SUBSCRIPTION_SERVICE_URL,
            payment: this.env.PAYMENT_SERVICE_URL,
            search: this.env.SEARCH_SERVICE_URL,
        };

        // Kiểm tra xem có URL nào bị thiếu không
        for (const [key, value] of Object.entries(urls)) {
            if (!value) {
                throw new Error(`${key.toUpperCase()}_SERVICE_URL is not defined in the environment variables.`);
            }
        }

        return urls as { [key: string]: string };
    }

    // Firebase Config
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

    // HTTPS Config
    public getServerKeyPath(): string {
        return this.env.SERVER_KEY_PATH || 'localhost-key.pem';
    }

    public getServerCertPath(): string {
        return this.env.SERVER_CERT_PATH || 'localhost.pem';
    }
}

export const envConfig = EnvConfig.getInstance(); 