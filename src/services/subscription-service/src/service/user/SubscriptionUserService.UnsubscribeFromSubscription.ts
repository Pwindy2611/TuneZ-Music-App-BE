import { subscriptionBaseService } from "../base/SubscriptionBaseService.js";
import { firestore } from "../../config/firebase/FireBaseConfig.js";

export const unsubscribeFromSubscription = async (userId: string, subscriptionId: string): Promise<void> => {
    try {
        const subscription = await subscriptionBaseService.getSubscriptionById(subscriptionId);
        if (!subscription) {
            throw new Error("Subscription not found");
        }

        const userSubscriptionRef = firestore.collection('users').doc(userId).collection('subscription').doc('current');
        const userSubscriptionDoc = await userSubscriptionRef.get();

        if (!userSubscriptionDoc.exists) {
            throw new Error("User does not have an active subscription");
        }

        const userSubscription = userSubscriptionDoc.data();
        if (!userSubscription) {
            throw new Error("Invalid subscription data");
        }

        const historyRef = firestore.collection('users')
            .doc(userId)
            .collection('subscription')
            .doc('history')
            .collection('cancelled')
            .doc(new Date().toISOString());

        await historyRef.set({
            ...userSubscription,
            endDate: new Date().toISOString(),
            status: 'cancelled'
        });

        await userSubscriptionRef.delete();

    } catch (error) {
        console.error("Error unsubscribing from subscription:", error);
        throw error;
    }
}; 