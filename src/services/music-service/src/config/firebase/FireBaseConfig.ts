import * as dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app'; 
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from "firebase-admin/firestore";
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_KEY_PATH;

if (!serviceAccountPath) {
    throw new Error("Firebase key path is not set in environment variables.");
}

const absoluteServiceAccountPath = path.resolve(serviceAccountPath);

let serviceAccount;
try {
    serviceAccount = JSON.parse(fs.readFileSync(absoluteServiceAccountPath, 'utf8'));
} catch (error) {
    throw new Error(`Error reading the service account key: ${error.message}`);
}

const app = initializeApp({
    credential: cert(serviceAccount as any),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
});


const database = getDatabase(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, database, firestore };
