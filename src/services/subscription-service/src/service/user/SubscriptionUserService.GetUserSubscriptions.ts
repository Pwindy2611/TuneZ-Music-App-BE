import { ISubscription } from "../../interface/object/ISubscription.js";
import { firestore } from "../../config/firebase/FireBaseConfig.js";

export const getUserSubscriptions = async (userId: string): Promise<ISubscription[]> => {
    try {
        const userSubscriptionRef = firestore.collection('users').doc(userId).collection('subscription').doc('current');
        const userSubscriptionDoc = await userSubscriptionRef.get();

        if (!userSubscriptionDoc.exists || !userSubscriptionDoc.data()) {
            return [];
        }

        const subscription = userSubscriptionDoc.data() as ISubscription & { 
            startDate: string;
            endDate: string;
        };

        const now = new Date();
        const endDate = new Date(subscription.endDate);
        
        if (endDate < now) {
            const historyRef = firestore.collection('users')
                .doc(userId)
                .collection('subscription')
                .doc('history')
                .collection('expired')
                .doc(subscription.endDate);

            await historyRef.set({
                ...subscription,
                status: 'expired'
            });

            await userSubscriptionRef.delete();
            return [];
        }

        return [subscription];
    } catch (error) {
        console.error("Error getting user subscriptions:", error);
        throw error;
    }
}; 