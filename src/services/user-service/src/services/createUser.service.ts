import {database} from "../config/firebase/firebase_config.js";
import {IUser} from "../interface/user.interface.js";

export const createUserService = async (user: IUser): Promise<string> => {
    try {
        const userRef = database.ref(`users/${user.userId}`);
        const role = "listener";
        const sessionToken = null;

        await userRef.set({
            ...user,
            role,
            sessionToken
        });

        return user.userId;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error creating new user: " + error.message);
        } else {
            throw new Error("Error creating new user: Unknown error");
        }
    }
};