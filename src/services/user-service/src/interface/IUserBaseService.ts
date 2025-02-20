import {IUser} from "./IUser.js";
import {UserDto} from "../dto/UserDto.js";

export interface IUserBaseService {
    createUser(user: IUser): Promise<string>;
    getAllUsers(): Promise<UserDto[] | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
}
