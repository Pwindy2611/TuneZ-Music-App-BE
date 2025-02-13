import * as dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app'; // Import from firebase-admin/app
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from "firebase-admin/firestore";
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from the .env file
dotenv.config();

// Ensure the Firebase key path is set in environment variables
const serviceAccountPath = process.env.FIREBASE_KEY_PATH;

if (!serviceAccountPath) {
    throw new Error("Firebase key path is not set in environment variables.");
}

// Ensure the service account file path is correctly resolved
const absoluteServiceAccountPath = path.resolve(serviceAccountPath);

// Read and parse the service account key JSON file
let serviceAccount;
try {
    serviceAccount = JSON.parse(fs.readFileSync(absoluteServiceAccountPath, 'utf8'));
} catch (error) {
    throw new Error(`Error reading the service account key: ${error.message}`);
}

// Initialize Firebase Admin SDK with the service account
const app = initializeApp({
    credential: cert(serviceAccount as any), // The `as any` cast avoids potential type issues
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
});


// Initialize the Firebase Realtime Database and Firebase Authentication
const database = getDatabase(app); // Use the initialized app directly
const auth = getAuth(app); // Use the initialized app directly
const firestore = getFirestore(app);

export { auth, database, firestore };
