import { ISubscriptionBaseService } from "../../interface/service/ISubscriptionBaseService.js";
import { database } from "../../config/firebase/FireBaseConfig.js";
import { ISubscription } from "../../interface/object/ISubscription.js";

export const updateSubscription: ISubscriptionBaseService['updateSubscription'] = async (subscriptionId, updatedSubscription) => {
    try {
        const subscriptionRef = database.ref(`subscriptions/${subscriptionId}`);
        const snapshot = await subscriptionRef.get();
        
        if (!snapshot.exists()) {
            throw new Error('Subscription not found');
        }
        
        const subscriptionToUpdate: ISubscription = {
            ...updatedSubscription,
            updatedAt: new Date().toISOString()
        };
        
        await subscriptionRef.update(subscriptionToUpdate);
        return subscriptionToUpdate;
    } catch (error) {
        throw new Error(`Failed to update subscription: ${error.message}`);
    }
} 