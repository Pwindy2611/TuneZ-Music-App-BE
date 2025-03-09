import {IUser} from "../object/IUser.js";
import {UserDto} from "../../dto/response/UserDto.js";

export interface IUserBaseService {
    createUser(user: IUser): Promise<string>;
    getAllUsers(): Promise<UserDto[] | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserCustomToken(email?: string, cookie?: string): Promise<string | null>;
}
