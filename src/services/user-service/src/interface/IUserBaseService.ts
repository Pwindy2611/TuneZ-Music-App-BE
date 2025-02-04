import {IUser} from "./IUser.js";

export interface IUserBaseService {
    createUser(user: IUser): Promise<string>;
    getAllUsers(): Promise<Record<string, IUser> | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
}
