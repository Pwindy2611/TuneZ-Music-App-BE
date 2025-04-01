import { ISubscriptionBaseService } from "../../interface/service/ISubscriptionBaseService.js";
import { createSubscription } from "./SubscriptionBaseService.CreateSubscription.js";
import { getSubscriptionById } from "./SubscriptionBaseService.GetSubscriptionById.js";
import { getAllSubscriptions } from "./SubscriptionBaseService.GetAllSubscriptions.js";
import { updateSubscription } from "./SubscriptionBaseService.UpdateSubscription.js";
import { deleteSubscription } from "./SubscriptionBaseService.DeleteSubscription.js";
import {isSubscription} from "./SubscriptionBaseService.IsSubscription.js";

class SubscriptionBaseService implements ISubscriptionBaseService {
    createSubscription = createSubscription;
    getSubscriptionById = getSubscriptionById;
    getAllSubscriptions = getAllSubscriptions;
    updateSubscription = updateSubscription;
    deleteSubscription = deleteSubscription;
    isSubscription = isSubscription;
}

export const subscriptionBaseService = new SubscriptionBaseService(); 