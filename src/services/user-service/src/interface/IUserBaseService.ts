import {IUser} from "./IUser.js";
import {UserDto} from "../Dto/UserDto.js";

export interface IUserBaseService {
    createUser(user: IUser): Promise<string>;
    loginUserGoogle(idToken: string): Promise<UserDto>;
    getAllUsers: () => Promise<UserDto[] | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
}
