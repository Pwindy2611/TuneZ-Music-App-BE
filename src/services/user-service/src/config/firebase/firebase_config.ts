import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app'; // Import cert from firebase-admin
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

// Load environment variables from the .env file
dotenv.config();

// Path to the service account key JSON file
const serviceAccount = require("../../../key/key.json");  // Make sure the file is a valid JSON file

// Initialize Firebase Admin SDK with the service account
admin.initializeApp({
    credential: cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
});

// Initialize the Firebase Realtime Database and Firebase Authentication
const database = getDatabase(); // Use the initialized app directly
const auth = getAuth(); // Use the initialized app directly

export { auth, database };

