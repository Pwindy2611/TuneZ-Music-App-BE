import { database } from "../../config/firebase/FireBaseConfig.js";
// Hàm để lưu session token
export const saveSessionTokenToDatabase = async (userId: string, sessionToken: string) => {
    try {
        const userRef = database.ref(`users/${userId}`);

        await userRef.update({
            "sessionToken": sessionToken,
        });

        console.log("Session token saved successfully!");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error saving session token:", error.message);
        } else {
            console.error("Error saving session token: Unknown error");
        }
    }
};

