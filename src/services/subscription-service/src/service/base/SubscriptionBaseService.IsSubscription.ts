import {ISubscriptionBaseService} from "../../interface/service/ISubscriptionBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";

export const isSubscription: ISubscriptionBaseService['isSubscription'] = async (id) => {
    try {
        const subscriptionRef = database.ref(`subscriptions/${id}`);
        const snapshot = await subscriptionRef.get();
        return snapshot.exists();
    }catch (error) {
        throw new Error(`Failed to check if subscription exists: ${error.message}`);
    }
}