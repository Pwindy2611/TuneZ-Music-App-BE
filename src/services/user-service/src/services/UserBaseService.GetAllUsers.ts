import {database} from "../config/firebase/FireBaseConfig.js";
import {IUserService} from "../interface/IUserBaseService.js";
export const getAllUsersService : IUserService["getAllUsers"] = async () => {
    const usersRef = database.ref('users');
    const snapshot = await usersRef.get();
    return snapshot.exists() ? snapshot.val() : null;
};