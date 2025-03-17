import { ISubscriptionBaseService } from "../../interface/service/ISubscriptionBaseService.js";
import { database } from "../../config/firebase/FireBaseConfig.js";
import { ISubscription } from "../../interface/object/ISubscription.js";

export const getAllSubscriptions: ISubscriptionBaseService['getAllSubscriptions'] = async () => {
    try {
        const snapshot = await database.ref('subscriptions').get();
        
        if (!snapshot.exists()) {
            return [];
        }
        
        const subscriptions: ISubscription[] = [];
        snapshot.forEach((childSnapshot) => {
            subscriptions.push(childSnapshot.val() as ISubscription);
        });
        
        return subscriptions;
    } catch (error) {
        throw new Error(`Failed to get all subscriptions: ${error.message}`);
    }
} 