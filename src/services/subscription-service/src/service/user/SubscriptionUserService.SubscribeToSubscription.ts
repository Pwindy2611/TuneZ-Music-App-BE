import { subscriptionBaseService } from "../base/SubscriptionBaseService.js";
import {firestore} from "../../config/firebase/FireBaseConfig.js";
import {userServiceClient} from "../../grpc/client/GrpcClients.js";
import {SubscriptionStatus} from "../../enum/SubscriptionStatus.js";

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

        const userSubscription = {
            subscriptionId: subscriptionId,
            duration: subscription.duration,
            features: subscription.features,
            status: SubscriptionStatus.ACTIVE,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + subscription.duration * 24 * 60 * 60 * 1000).toISOString()
        };

        await userSubscriptionRef.set(userSubscription);
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
        console.error("Error subscribing to subscription:", error);
        throw error;
    }
};
