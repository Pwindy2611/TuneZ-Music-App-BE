import { ref, update } from "firebase/database";
import { database } from "../../config/firebase/firebase_config";
// Hàm để lưu session token
export const saveSessionTokenToDatabase = async (userId: string, sessionToken: string) => {
    try {
        // Tạo đường dẫn đến user cụ thể trong database
        const userRef = ref(database, `users/${userId}`);

        // Cập nhật session token
        await update(userRef, {
            "sessionToken": sessionToken,
        });

        console.log("Session token saved successfully!");
    } catch (error) {
        console.error("Error saving session token:", error.message);
    }
};
