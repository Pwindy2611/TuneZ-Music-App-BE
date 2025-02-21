import {database} from "../config/firebase/FireBaseConfig.js";
import {IUserBaseService} from "../interface/IUserBaseService.js";
import {UserDto} from "../dto/UserDto.js";
import {SubscriptionType} from "../enum/SubscriptionType.js";
import {IUser} from "../interface/IUser.js";

export const getAllUsersService: IUserBaseService["getAllUsers"] = async () => {
    const usersRef = database.ref('users');
    const snapshot = await usersRef.get();
    if (!snapshot.exists()) {
        return null;
    }

    const usersData = snapshot.val();
    return Object.values(usersData).map(user => {
        const typedUser = user as IUser;
        return new UserDto(typedUser);
    });
};