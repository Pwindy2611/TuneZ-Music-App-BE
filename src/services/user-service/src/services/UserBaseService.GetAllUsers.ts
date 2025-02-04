import {database} from "../config/firebase/FireBaseConfig.js";
import {IUserBaseService} from "../interface/IUserBaseService.js";
export const getAllUsersService : IUserBaseService["getAllUsers"] = async () => {
    const usersRef = database.ref('users');
    const snapshot = await usersRef.get();
    return snapshot.exists() ? snapshot.val() : null;
};