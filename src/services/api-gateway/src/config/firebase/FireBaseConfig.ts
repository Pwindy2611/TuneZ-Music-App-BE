import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as fs from "fs";
import * as path from "path";
import { envConfig } from "../EnvConfig.js";

class FirebaseSingleton {
    private static instance: FirebaseSingleton;
    public auth;

    private constructor() {
        const serviceAccountPath = envConfig.getFirebaseKeyPath();
        const absoluteServiceAccountPath = path.resolve(serviceAccountPath);
        let serviceAccount;

        try {
            serviceAccount = JSON.parse(fs.readFileSync(absoluteServiceAccountPath, "utf8"));
        } catch (error) {
            throw new Error(`Error reading the service account key: ${error.message}`);
        }

        const app = getApps().length === 0
            ? initializeApp({
                credential: cert(serviceAccount as any),
                databaseURL: envConfig.getFirebaseDatabaseUrl(),
                projectId: envConfig.getFirebaseProjectId(),
            })
            : getApp();

        this.auth = getAuth(app);
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
