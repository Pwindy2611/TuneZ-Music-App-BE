import {database} from "../config/firebase/firebase_config.js";
import {IUser} from "../interface/user.interface.js";
export const getAllUsersService = async (): Promise<Record<string, IUser> | null> => {
    const usersRef = database.ref('users');
    const snapshot = await usersRef.get();
    return snapshot.exists() ? snapshot.val() : null;
};