import {IUser} from "../object/IUser.js";

export interface IUserService {
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
    resetPassword(email: string): Promise<boolean>;
    verifyEmail(email: string): Promise<boolean>;
    getUserById(userId: string): Promise<IUser | null>;
}