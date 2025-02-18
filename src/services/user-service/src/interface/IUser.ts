import {UserRole} from "../enum/UserRole.js";
import {SubscriptionType} from "../enum/SubscriptionType.js";

export interface IUser {
    _id: string;
    email: string;
    username: string;
    role?: UserRole;
    
    account? : {
        subscriptionType: SubscriptionType,
        createdAt: Date,
        lastLogin: Date,
    };
    sessionToken?: string | null;
}
