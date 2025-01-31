import {IUser} from "./IUser.js";

export interface IUserService {
    createUser(user: IUser): Promise<string>;
    getAllUsers(): Promise<Record<string, IUser> | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
}
