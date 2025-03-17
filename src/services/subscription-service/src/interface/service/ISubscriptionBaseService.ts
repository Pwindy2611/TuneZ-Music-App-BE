import {ISubscription} from "../object/ISubscription.js";

export interface ISubscriptionBaseService {
    createSubscription(subscription: ISubscription): Promise<ISubscription>;
    getSubscriptionById(subscriptionId: string): Promise<ISubscription>;
    getAllSubscriptions(): Promise<ISubscription[]>;
    updateSubscription(subscriptionId: string, updatedSubscription: ISubscription): Promise<ISubscription>;
    deleteSubscription(subscriptionId: string): Promise<void>;
}