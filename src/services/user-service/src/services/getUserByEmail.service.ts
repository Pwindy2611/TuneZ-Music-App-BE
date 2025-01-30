import {database} from "../config/firebase/firebase_config.js";
import {IUser} from "../interface/user.interface.js";

export const getUserByEmailService = async (email: string): Promise<IUser | null> => {
    try {
        const userRef = database.ref('users');
        const snapshot = await userRef.orderByChild('email').equalTo(email).once('value');

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const userId = Object.keys(userData)[0]; // Lấy userId đầu tiên
            return userData[userId] as IUser;
        } else {
            return null;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error fetching user by email: " + error.message);
        } else {
            throw new Error("Error fetching user by email: Unknown error");
        }
    }
};