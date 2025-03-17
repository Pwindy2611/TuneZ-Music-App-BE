import {ISubscription} from "../object/ISubscription.js";

export interface ISubscriptionUserService {
    getUserSubscriptions(userId: string): Promise<ISubscription[]>;
    subscribeToSubscription(userId: string, subscriptionId: string): Promise<void>;
    unsubscribeFromSubscription(userId: string, subscriptionId: string): Promise<void>;
    renewSubscription(userId: string, subscriptionId: string): Promise<void>;
}