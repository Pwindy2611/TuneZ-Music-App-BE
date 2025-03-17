import { ISubscriptionBaseService } from "../../interface/service/ISubscriptionBaseService.js";
import { database } from "../../config/firebase/FireBaseConfig.js";
import { ISubscription } from "../../interface/object/ISubscription.js";

export const getSubscriptionById: ISubscriptionBaseService['getSubscriptionById'] = async (subscriptionId) => {
    try {
        const subscriptionRef = database.ref(`subscriptions/${subscriptionId}`);
        const snapshot = await subscriptionRef.get();
        
        if (!snapshot.exists()) {
            throw new Error('Subscription not found');
        }
        
        return snapshot.val() as ISubscription;
    } catch (error) {
        throw new Error(`Failed to get subscription: ${error.message}`);
    }
} 