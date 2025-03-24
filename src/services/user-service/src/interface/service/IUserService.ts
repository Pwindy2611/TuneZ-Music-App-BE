import {IUserProfile} from "../object/IUserProfile.js";

export interface IUserService {
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
    resetPassword(email: string): Promise<boolean>;
    verifyEmail(email: string): Promise<boolean>;
    getUserInfoById(userId: string): Promise<IUserProfile | null>;
    updateSubscriptionType(userId: string): Promise<boolean>;
}