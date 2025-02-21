import {database} from "../config/firebase/FireBaseConfig.js";
import {IUserBaseService} from "../interface/IUserBaseService.js";
import {UserRole} from "../enum/UserRole.js";
import {SubscriptionType} from "../enum/SubscriptionType.js";

export const createUserService : IUserBaseService["createUser"] = async (user): Promise<string> => {
    try {
        const userRef = database.ref(`users/${user._id}`);
        const role = UserRole.LISTENER;
        const sessionToken = null;
        const account = {
            subscriptionType: SubscriptionType.NORMAL,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
        }
        await userRef.set({
            ...user,
            account,
            role,
            sessionToken
        });

        return user._id;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error creating new user: " + error.message);
        } else {
            throw new Error("Error creating new user: Unknown error");
        }
    }
};