import { subscriptionBaseService } from "../base/SubscriptionBaseService.js";
import { firestore } from "../../config/firebase/FireBaseConfig.js";
import {SubscriptionStatus} from "../../enum/SubscriptionStatus.js";
import {userServiceClient} from "../../grpc/client/GrpcClients.js";

export const unsubscribeFromSubscription = async (userId: string, subscriptionId: string): Promise<void> => {
    try {
        const subscription = await subscriptionBaseService.getSubscriptionById(subscriptionId);
        if (!subscription) {
            return Promise.reject(new Error("Subscription not found"));
        }

        const userSubscriptionRef = firestore.collection('users').doc(userId).collection('subscription').doc('current');
        const userSubscriptionDoc = await userSubscriptionRef.get();

        if (!userSubscriptionDoc.exists) {
            return Promise.reject(new Error("User does not have an active subscription"));
        }

        const userSubscription = userSubscriptionDoc.data();
        if (!userSubscription) {
            return Promise.reject(new Error("Invalid subscription data"));
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
            status: SubscriptionStatus.CANCELLED,
        });

        await userSubscriptionRef.delete();

        await new Promise((resolve, reject) => {
            userServiceClient.updateSubscriptionType({ userId }, (err: any, data:any) => {
                if (err) {
                    console.error("Error updating subscription type:", err);
                    return reject(err);
                }
                resolve(data);
            });
        })
    } catch (error) {
        console.error("Error unsubscribing from subscription:", error);
        throw error;
    }
}; 