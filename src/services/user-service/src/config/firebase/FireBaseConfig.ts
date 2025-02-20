import * as dotenv from "dotenv";
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

class FirebaseSingleton {
    private static instance: FirebaseSingleton;
    public auth;
    public database;

    private constructor() {
        const serviceAccountPath = process.env.FIREBASE_KEY_PATH;

        if (!serviceAccountPath) {
            throw new Error("Firebase key path is not set in environment variables.");
        }

        const absoluteServiceAccountPath = path.resolve(serviceAccountPath);
        let serviceAccount;

        try {
            serviceAccount = JSON.parse(fs.readFileSync(absoluteServiceAccountPath, "utf8"));
        } catch (error) {
            throw new Error(`Error reading the service account key: ${error.message}`);
        }

        // Kiểm tra xem Firebase đã được khởi tạo chưa
        const app = getApps().length === 0
            ? initializeApp({
                credential: cert(serviceAccount as any),
                databaseURL: process.env.FIREBASE_DATABASE_URL,
                projectId: process.env.FIREBASE_PROJECT_ID,
            })
            : getApp();

        this.auth = getAuth(app);
        this.database = getDatabase(app);
    }

    public static getInstance(): FirebaseSingleton {
        if (!FirebaseSingleton.instance) {
            FirebaseSingleton.instance = new FirebaseSingleton();
        }
        return FirebaseSingleton.instance;
    }
}

const firebaseInstance = FirebaseSingleton.getInstance();
export const auth = firebaseInstance.auth;
export const database = firebaseInstance.database;
