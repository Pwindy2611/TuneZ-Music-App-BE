import { ISubscriptionUserService } from '../../interface/service/ISubscriptionUserService.js';
import { getUserSubscriptions } from './SubscriptionUserService.GetUserSubscriptions.js';
import { subscribeToSubscription } from './SubscriptionUserService.SubscribeToSubscription.js';
import { unsubscribeFromSubscription } from './SubscriptionUserService.UnsubscribeFromSubscription.js';
import { renewSubscription } from './SubscriptionUserService.RenewSubscription.js';

class SubscriptionUserService implements ISubscriptionUserService {
    getUserSubscriptions = getUserSubscriptions;
    subscribeToSubscription = subscribeToSubscription;
    unsubscribeFromSubscription = unsubscribeFromSubscription;
    renewSubscription = renewSubscription;
}

export const subscriptionUserService = new SubscriptionUserService(); 