import { Request, Response } from 'express';
import { subscriptionBaseService } from '../service/base/SubscriptionBaseService.js';
import { ISubscription } from '../interface/object/ISubscription.js';
import { subscriptionUserService } from '../service/user/SubscriptionUserService.js';
import { IAuthRequest } from '../interface/object/IAuthRequest.js';

export class SubscriptionController {
    async createSubscriptionApi(req: Request, res: Response) {
        try {
            const subscriptionData: ISubscription = req.body;
            const subscription = await subscriptionBaseService.createSubscription(subscriptionData);

            res.status(201).json({
                status: 201,
                success: true,
                data: subscription,
                message: "Subscription created successfully"
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message
            });
        }
    }

    async getSubscriptionByIdApi(req: Request, res: Response) {
        try {
            const subscriptionId = req.params.id;
            const subscription = await subscriptionBaseService.getSubscriptionById(subscriptionId);

            res.status(200).json({
                status: 200,
                success: true,
                data: subscription
            });
        } catch (error) {
            if (error.message === 'Subscription not found') {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message
                });
            }
        }
    }

    async getAllSubscriptionsApi(req: Request, res: Response) {
        try {
            const subscriptions = await subscriptionBaseService.getAllSubscriptions();

            res.status(200).json({
                status: 200,
                success: true,
                data: subscriptions
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message
            });
        }
    }

    async updateSubscriptionApi(req: Request, res: Response) {
        try {
            const subscriptionId = req.params.id;
            const subscriptionData: ISubscription = req.body;
            const subscription = await subscriptionBaseService.updateSubscription(subscriptionId, subscriptionData);

            res.status(200).json({
                status: 200,
                success: true,
                data: subscription,
                message: "Subscription updated successfully"
            });
        } catch (error) {
            if (error.message === 'Subscription not found') {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message
                });
            }
        }
    }

    async deleteSubscriptionApi(req: Request, res: Response) {
        try {
            const subscriptionId = req.params.id;
            await subscriptionBaseService.deleteSubscription(subscriptionId);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Subscription deleted successfully"
            });
        } catch (error) {
            if (error.message === 'Subscription not found') {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message
                });
            }
        }
    }

    async getUserSubscriptionsApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: "Unauthorized"
                });
                return;
            }
            const subscriptions = await subscriptionUserService.getUserSubscriptions(userId);

            res.status(200).json({
                status: 200,
                success: true,
                data: subscriptions
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message
            });
        }
    }

    async subscribeToSubscriptionApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: "Unauthorized"
                });
                return;
            }

            const subscriptionId = req.params.subscriptionId;
            await subscriptionUserService.subscribeToSubscription(userId, subscriptionId);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Subscribed to subscription successfully"
            });
        } catch (error) {
            if (error.message === "Subscription not found") {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: error.message
                });
            } else if (error.message === "User already has an active subscription") {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message
                });
            }
        }
    }

    async unsubscribeFromSubscriptionApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: "Unauthorized"
                });
                return;
            }
            const subscriptionId = req.params.subscriptionId;
            await subscriptionUserService.unsubscribeFromSubscription(userId, subscriptionId);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Unsubscribed from subscription successfully"
            });
        } catch (error) {
            if (error.message === "Subscription not found") {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: error.message
                });
            } else if (error.message === "User does not have an active subscription") {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message
                });
            }
        }
    }

    async renewSubscriptionApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: "Unauthorized"
                });
                return;
            }
            const subscriptionId = req.params.subscriptionId;
            await subscriptionUserService.renewSubscription(userId, subscriptionId);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Subscription renewed successfully"
            });
        } catch (error) {
            if (error.message === "Subscription not found") {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: error.message
                });
            } else if (error.message === "No expired subscription found to renew") {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message
                });
            }
        }
    }
}

export const subscriptionController = new SubscriptionController();
