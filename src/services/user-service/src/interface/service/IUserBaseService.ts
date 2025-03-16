import {IUser} from "../object/IUser.js";
import {UserDto} from "../../dto/response/UserDto.js";

export interface IUserBaseService {
    createUser(user: IUser): Promise<string>;
    updateUser(user: IUser): Promise<string>;
    deleteUser(userId: string): Promise<void>;
    getAllUsers(): Promise<UserDto[] | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserCustomToken(email?: string, cookie?: string): Promise<string | null>;
}
