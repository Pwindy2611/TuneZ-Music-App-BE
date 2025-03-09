import {IUser} from "./IUser.js";

export interface IUserService {
    updateUser(userId: string, user: IUser): Promise<boolean>;
    deleteUser(userId: string): Promise<boolean>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
    resetPassword(email: string): Promise<boolean>;
    verifyEmail(email: string): Promise<boolean>;
    getUserById(userId: string): Promise<IUser | null>;
}