import { ISubscriptionBaseService } from "../../interface/service/ISubscriptionBaseService.js";
import { database } from "../../config/firebase/FireBaseConfig.js";

export const deleteSubscription: ISubscriptionBaseService['deleteSubscription'] = async (subscriptionId) => {
    try {
        const subscriptionRef = database.ref(`subscriptions/${subscriptionId}`);
        const snapshot = await subscriptionRef.get();
        
        if (!snapshot.exists()) {
            throw new Error('Subscription not found');
        }
        
        await subscriptionRef.remove();
    } catch (error) {
        throw new Error(`Failed to delete subscription: ${error.message}`);
    }
} 