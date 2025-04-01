import {ISubscription} from "../object/ISubscription.js";

export interface ISubscriptionUserService {
    getUserSubscriptions(userId: string): Promise<ISubscription|null>;
    subscribeToSubscription(userId: string, subscriptionId: string): Promise<void>;
    unsubscribeFromSubscription(userId: string, subscriptionId: string): Promise<void>;
    renewSubscription(userId: string, subscriptionId: string): Promise<void>;
}