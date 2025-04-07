import * as dotenv from "dotenv";
import { initializeApp, cert, App, getApps, getApp } from "firebase-admin/app";
import { getDatabase, Database } from "firebase-admin/database";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";
import { envConfig } from "../EnvConfig.js";

dotenv.config();

class FirebaseSingleton {
    private static instance: FirebaseSingleton;
    public app: App;
    public database: Database;
    public firestore: Firestore;

    private constructor() {
        if (getApps().length > 0) {
            this.app = getApp();
        } else {
            const serviceAccountPath = envConfig.getFirebaseKeyPath();
            const absoluteServiceAccountPath = path.resolve(serviceAccountPath);

            let serviceAccount;
            try {
                serviceAccount = JSON.parse(fs.readFileSync(absoluteServiceAccountPath, "utf8"));
            } catch (error) {
                throw new Error(`Error reading the service account key: ${error.message}`);
            }

            this.app = initializeApp({
                credential: cert(serviceAccount),
                databaseURL: envConfig.getFirebaseDatabaseUrl(),
                projectId: envConfig.getFirebaseProjectId(),
            });
        }

        this.database = getDatabase(this.app);
        this.firestore = getFirestore(this.app);
    }

    public static getInstance(): FirebaseSingleton {
        if (!FirebaseSingleton.instance) {
            FirebaseSingleton.instance = new FirebaseSingleton();
        }
        return FirebaseSingleton.instance;
    }
}

const firebaseInstance = FirebaseSingleton.getInstance();
export const database = firebaseInstance.database;
export const firestore = firebaseInstance.firestore;
