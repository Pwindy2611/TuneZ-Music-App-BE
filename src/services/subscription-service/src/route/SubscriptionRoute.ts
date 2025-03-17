import { Router } from 'express';
import { subscriptionController } from '../controller/SubscriptionController.js';
import { authMiddleware } from '../util/middleware/AuthMiddleware.js';

const router = Router();

router.post('/createSubscription', subscriptionController.createSubscriptionApi);

router.get('/getSubscriptionById/:id', subscriptionController.getSubscriptionByIdApi);

router.get('/getAllSubscriptions', subscriptionController.getAllSubscriptionsApi);

router.post('/updateSubscription/:id', subscriptionController.updateSubscriptionApi);

router.delete('/deleteSubscription/:id', subscriptionController.deleteSubscriptionApi);

router.get('/getUserSubscriptions', authMiddleware, subscriptionController.getUserSubscriptionsApi);

router.post('/subscribeToSubscription/:subscriptionId', authMiddleware, subscriptionController.subscribeToSubscriptionApi);

router.post('/unsubscribeFromSubscription/:subscriptionId', authMiddleware, subscriptionController.unsubscribeFromSubscriptionApi);

router.post('/renewSubscription/:subscriptionId', authMiddleware, subscriptionController.renewSubscriptionApi);

export default router; 