import { Router } from 'express';
import { subscriptionController } from '../controller/SubscriptionController.js';
import { authMiddleware } from '../util/middleware/AuthMiddleware.js';

const router = Router();

//SYSTEM
router.post('/createSubscription', subscriptionController.createSubscriptionApi);
router.post('/updateSubscription/:id', subscriptionController.updateSubscriptionApi);
router.delete('/deleteSubscription/:id', subscriptionController.deleteSubscriptionApi);

//USER
router.post('/subscribeToSubscription/:subscriptionId', authMiddleware, subscriptionController.subscribeToSubscriptionApi);
router.post('/unsubscribeFromSubscription/:subscriptionId', authMiddleware, subscriptionController.unsubscribeFromSubscriptionApi);
router.post('/renewSubscription/:subscriptionId', authMiddleware, subscriptionController.renewSubscriptionApi);

//GET
router.get('/getSubscriptionById/:id', subscriptionController.getSubscriptionByIdApi);
router.get('/getAllSubscriptions', subscriptionController.getAllSubscriptionsApi);
router.get('/getUserSubscriptions', authMiddleware, subscriptionController.getUserSubscriptionsApi);

export default router; 