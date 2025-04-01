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
        const port = this.env.GRPC_PORT_PAYMENT_SERVICE;
        if (!port) {
            throw new Error("GRPC_PORT_PAYMENT_SERVICE is not defined in the environment variables.");
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

    public getRpcUserServicePort(): number {
        const port = this.env.GRPC_PORT_USER_SERVICE;
        if (!port) {
            throw new Error("GRPC_PORT_USER_SERVICE is not defined in the environment variables.");
        }
        return parseInt(port, 10);
    }

    public getRpcSubscriptionServicePort(): number {
        const port = this.env.GRPC_PORT_SUBSCRIPTION_SERVICE;
        if (!port) {
            throw new Error("GRPC_PORT_SUBSCRIPTION_SERVICE is not defined in the environment variables.");
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

    public getRedisUrl(): string {
        const url = this.env.REDIS_URL;
        if (!url) {
            throw new Error("REDIS_URL is not defined in the environment variables.");
        }
        return url;
    }

    public getMomoConfig() {
        const partnerCode = this.env.MOMO_PARTNER_CODE;
        const publicKey = this.env.MOMO_PUBLIC_KEY;
        const returnUrl = this.env.MOMO_RETURN_URL;
        const paymentUrl = this.env.MOMO_PAYMENT_URL;
        const aesTokenUrl = this.env.MOMO_AES_TOKEN_URL;
        const ipnUrl = this.env.MOMO_IPN_URL;
        const disbursementUrl = this.env.MOMO_DISBURSEMENT_URL;
        const transactionStatusUrl = this.env.MOMO_TRANSACTION_STATUS_URL;
        const accessKey = this.env.MOMO_ACCESS_KEY;
        const secretKey = this.env.MOMO_SECRET_KEY;
        const storeId = this.env.MOMO_STORE_ID;
        const storeName = this.env.MOMO_STORE_NAME;
        const logo = this.env.MOMO_LOGO;

        if (!partnerCode || !publicKey || !returnUrl || !paymentUrl || !ipnUrl || !accessKey || !secretKey || !storeId) {
            throw new Error("Momo environment variables are not set.");
        }

        return {
            partnerCode,
            publicKey,
            returnUrl,
            paymentUrl,
            aesTokenUrl,
            ipnUrl,
            disbursementUrl,
            transactionStatusUrl,
            accessKey,
            secretKey,
            storeId,
            storeName,
            logo
        };
    }

    public getMomoTestConfig() {
        const partnerCode = this.env.MOMO_TEST_PARTNER_CODE;
        const accessKey = this.env.MOMO_TEST_ACCESS_KEY;
        const secretKey = this.env.MOMO_TEST_SECRET_KEY;
        const redirectUrl = this.env.MOMO_TEST_RETURN_URL;
        const ipnUrl = this.env.MOMO_TEST_IPN_URL;
        const paymentUrl = this.env.MOMO_TEST_PAYMENT_URL;
        const aesTokenUrl = this.env.MOMO_TEST_AES_TOKEN_URL;
        const disbursementUrl = this.env.MOMO_TEST_DISBURSEMENT_URL;
        const transactionStatusUrl = this.env.MOMO_TEST_TRANSACTION_STATUS_URL;
        const storeId = this.env.MOMO_TEST_STORE_ID;
        const storeName = this.env.MOMO_STORE_NAME;
        const logo = this.env.MOMO_LOGO;
        const publicKey = this.env.MOMO_PUBLIC_KEY;

        if (!partnerCode || !accessKey || !secretKey || !redirectUrl || !paymentUrl || !ipnUrl || !storeId || !publicKey || !storeName || !logo) {
            throw new Error("Momo test environment variables are not set.");
        }

        return {
            partnerCode,
            accessKey,
            secretKey,
            redirectUrl,
            ipnUrl,
            paymentUrl,
            aesTokenUrl,
            disbursementUrl,
            transactionStatusUrl,
            storeId,
            storeName,
            logo,
            publicKey
        };
    }
}

export const envConfig = EnvConfig.getInstance(); 