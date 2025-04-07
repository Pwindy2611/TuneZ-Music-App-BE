import { ISubscriptionBaseService } from "../../interface/service/ISubscriptionBaseService.js";
import { database } from "../../config/firebase/FireBaseConfig.js";
import { ISubscription } from "../../interface/object/ISubscription.js";

export const createSubscription: ISubscriptionBaseService['createSubscription'] = async (subscription) => {
    try {
        const subscriptionRef = database.ref('subscriptions').push();

        const newSubscription: ISubscription = {
            ...subscription,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await subscriptionRef.set(newSubscription);
        return newSubscription;
    } catch (error) {
        throw new Error(`Failed to create subscription: ${error.message}`);
    }
} 