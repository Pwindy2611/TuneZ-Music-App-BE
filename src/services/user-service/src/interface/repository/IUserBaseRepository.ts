import {IUser} from "../object/IUser.js";
import {UserDto} from "../../dto/response/UserDto.js";

export interface IUserBaseRepository {
    createUser(user: IUser): Promise<void>;
    deleteUser(userId: string): Promise<void>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getAllUsers(): Promise<UserDto[] | null>;
    getUserCustomToken(userIdentifier: string): Promise<string | null>;
}