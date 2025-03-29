import {UserRole} from "../../enum/UserRole.js";
import {SubscriptionType} from "../../enum/SubscriptionType.js";

export interface IUser {
    _id: string;
    email: string;
    username: string;
    role?: UserRole;
    profilePictureUrl?: string;
    account? : {
        subscriptionType: SubscriptionType,
        createdAt: string,
        lastLogin: string,
    };
    sessionToken?: string | null;
}
