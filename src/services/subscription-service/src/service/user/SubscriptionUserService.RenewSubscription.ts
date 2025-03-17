import { subscriptionBaseService } from "../base/SubscriptionBaseService.js";
import { firestore } from "../../config/firebase/FireBaseConfig.js";
import { ISubscription } from "../../interface/object/ISubscription.js";

export const renewSubscription = async (userId: string, subscriptionId: string): Promise<void> => {
    try {
        const subscription = await subscriptionBaseService.getSubscriptionById(subscriptionId);
        if (!subscription) {
            throw new Error("Subscription not found");
        }

        const expiredRef = firestore.collection('users')
            .doc(userId)
            .collection('subscription')
            .doc('history')
            .collection('expired')
            .doc(subscriptionId);

        const expiredDoc = await expiredRef.get();
        if (!expiredDoc.exists) {
            throw new Error("No expired subscription found to renew");
        }

        const newSubscription: ISubscription & { startDate: string; endDate: string } = {
            ...subscription,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + subscription.duration * 24 * 60 * 60 * 1000).toISOString()
        };

        const currentRef = firestore.collection('users')
            .doc(userId)
            .collection('subscription')
            .doc('current');

        await currentRef.set(newSubscription);
        await expiredRef.delete();

    } catch (error) {
        console.error("Error renewing subscription:", error);
        throw error;
    }
}; 