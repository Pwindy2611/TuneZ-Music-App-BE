import {database} from "../config/firebase/FireBaseConfig.js";
import {IUserService} from "../interface/IUserBaseService.js";

export const createUserService : IUserService["createUser"] = async (user): Promise<string> => {
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