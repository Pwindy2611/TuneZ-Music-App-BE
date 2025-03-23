import { subscriptionBaseService } from "../base/SubscriptionBaseService.js";
import { firestore } from "../../config/firebase/FireBaseConfig.js";
import { ISubscription } from "../../interface/object/ISubscription.js";

export const subscribeToSubscription = async (userId: string, subscriptionId: string): Promise<void> => {
    try {
        const subscription = await subscriptionBaseService.getSubscriptionById(subscriptionId);
        if (!subscription) {
            return Promise.reject(new Error("Subscription not found"));
        }

        const userSubscriptionRef = firestore.collection('users').doc(userId).collection('subscription').doc('current');
        const userSubscriptionDoc = await userSubscriptionRef.get();

        if (userSubscriptionDoc.exists) {
            return Promise.reject(new Error("User already has an active subscription"));
        }

        const userSubscription: ISubscription & { startDate: string; endDate: string } = {
            ...subscription,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + subscription.duration * 24 * 60 * 60 * 1000).toISOString()
        };

        await userSubscriptionRef.set(userSubscription);

    } catch (error) {
        console.error("Error subscribing to subscription:", error);
        throw error;
    }
};
