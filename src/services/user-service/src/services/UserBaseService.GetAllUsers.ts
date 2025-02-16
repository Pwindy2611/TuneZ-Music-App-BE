import {database} from "../config/firebase/FireBaseConfig.js";
import {IUserBaseService} from "../interface/IUserBaseService.js";
import {UserDto} from "../dto/UserDto.js";

export const getAllUsersService: IUserBaseService["getAllUsers"] = async () => {
    const usersRef = database.ref('users');
    const snapshot = await usersRef.get();
    if (!snapshot.exists()) {
        return null;
    }

    const usersData = snapshot.val();
    return Object.values(usersData).map(user => {
        const {userId, email, username, role, sessionToken} = user as {
            userId: string;
            email: string;
            username: string;
            role: string;
            sessionToken: string;
        };
        return new UserDto(userId, email, username, role, sessionToken);
    });
};