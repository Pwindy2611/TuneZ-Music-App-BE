import { Request, Response, NextFunction } from 'express';
import { IPaymentService } from '../interface/service/IPaymentService.js';
import { ICreatePaymentRequest } from '../interface/request/ICreatePaymentRequest.js';
import { IUpdatePaymentStatusRequest } from '../interface/request/IUpdatePaymentStatusRequest.js';
import { IAuthRequest } from '../interface/request/IAuthRequest.js';
import { PaymentCurrency } from '../enum/PaymentCurrency.js';
import { CryptoUtil } from '../util/CryptoUtil.js';
import { PaymentMethod } from '../enum/PaymentMethod.js';
import { IPaymentRequest } from '../interface/request/IPaymentRequest.js';
import {PaymentRepository} from "../repository/PaymentRepository.js";

export class PaymentController {
  private static instance: PaymentController;
  private paymentService: IPaymentService | null = null;

  private constructor() {}

  public static getInstance(): PaymentController {
    if (!PaymentController.instance) {
      PaymentController.instance = new PaymentController();
    }
    return PaymentController.instance;
  }

  public setPaymentService(paymentService: IPaymentService) {
    this.paymentService = paymentService;
  }

  private getPaymentService(): IPaymentService {
    if (!this.paymentService) {
      throw new Error('PaymentService not initialized');
    }
    return this.paymentService;
  }

  private generateOrderId(itemId: string, userId: string): string {
    return CryptoUtil.generateOrderId(itemId, userId);
  }

  async createPayment(req: IAuthRequest, res: Response) {
    try {
      const userId = req.userId;
      
      if (!userId) {
        res.status(401).json({
          status: 401,
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const { itemId, amount, paymentMethod} = req.body;

      if (!itemId || !userId || !amount || !paymentMethod) {
        res.status(400).json({
          status: 400,
          success: false,
          message: 'Missing required fields: itemId, userId, amount, paymentMethod'
        });
        return;
      }
      if (amount <= 0) {
        res.status(400).json({
          status: 400,
          success: false,
          message: 'Amount must be a positive number'
        });
        return;
      }

      if (!Object.values(PaymentMethod).includes(paymentMethod)) {
        res.status(400).json({
          status: 400,
          success: false,
          message: 'Invalid payment method'
        });
        return;
      }

      const orderId = this.generateOrderId(itemId, userId);
      const paymentData: ICreatePaymentRequest = {
        orderId,
        amount,
        paymentMethod,
        referenceId: `${userId}::${itemId}`,
        orderInfo: `Thanh toán đơn hàng ${orderId}`,
        currency: PaymentCurrency.VND,
      };

      const paymentResponse = await this.getPaymentService().createPayment(paymentData);


      res.status(201).json({
        status: 201,
        success: true,
        data: paymentResponse
      });


    } catch (error) {
      console.error('Create Payment Error:', error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async handlePaymentCallback(req: IPaymentRequest, res: Response, next: NextFunction) {
    try {
      const payment = await PaymentRepository.findById(req.query.orderId as string);
      if (!payment) {
        res.status(404).json({
          status: 404,
          success: false,
          message: 'Payment not found'
        });
        return
      }

      const referenceId = payment.referenceId;
      const regex = /^(.+?)::(.+?)$/;
      const match = referenceId.match(regex);
      if (!match) {
        res.status(400).json({
          status: 400,
          success: false,
          message: 'Invalid referenceId format'
        });
        return;
      }

      const userId = match[1];

      const itemId = match[2];

        if (!userId) {
            res.status(401).json({
            status: 401,
            success: false,
            message: 'Unauthorized'
            });
            return;
        }

        if (!itemId) {
            res.status(400).json({
            status: 400,
            success: false,
            message: 'Missing required field: itemId'
            });
            return;
        }

      const callbackData = {
        partnerCode: req.query.partnerCode as string,
        orderId: req.query.orderId as string,
        requestId: req.query.requestId as string,
        amount: Number(req.query.amount),
        orderInfo: req.query.orderInfo as string,
        orderType: req.query.orderType as string,
        transId: req.query.transId as string,
        resultCode: Number(req.query.resultCode),
        message: req.query.message as string,
        payType: req.query.payType as string,
        responseTime: Number(req.query.responseTime),
        extraData: req.query.extraData as string,
        signature: req.query.signature as string
      };

      if (!callbackData.orderId) {
        return Promise.reject( new Error('Missing required field: orderId'));
      }

      console.log('Momo Callback Query:', JSON.stringify(callbackData, null, 2));

      req.paymentResponse = await this.getPaymentService().verifyPaymentCallback(itemId, userId, callbackData);
      
      next();
    } catch (error) {
      console.error('Payment Callback Error:', error);
      res.status(500).json({
        status: 500,
        success: false,
        message: error.message
      });
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const updateData: IUpdatePaymentStatusRequest = req.body;

      const paymentResponse = await this.getPaymentService().updatePaymentStatus(
        paymentId,
        updateData
      );

      res.status(200).json({
        status: 200,
        success: true,
        data: paymentResponse
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: error.message
      });
    }
  }

  async cancelPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;

      const paymentResponse = await this.getPaymentService().cancelPayment(paymentId);

      res.status(200).json({
        status: 200,
        success: true,
        data: paymentResponse
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: error.message
      });
    }
  }

  async refundPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const { amount } = req.body;

      const paymentResponse = await this.getPaymentService().refundPayment(
        paymentId,
        amount
      );

      res.status(200).json({
        status: 200,
        success: true,
        data: paymentResponse
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: error.message
      });
    }
  }

  async getPayment(req: Request, res: Response) {
    try {
      const orderId = req.query.orderId as string;

      if (!orderId) {
        res.status(400).json({
          status: 400,
          success: false,
          message: 'Missing orderId parameter'
        });
        return;
      }

      const paymentResponse = await this.getPaymentService().getPayment(orderId);

      res.status(200).json({
        status: 200,
        success: true,
        data: paymentResponse
      });
    } catch (error) {
      console.error('Get Payment Error:', error);
      res.status(500).json({
        status: 500,
        success: false,
        message: error.message
      });
    }
  }

  async listPayments(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;

      const payments = await this.getPaymentService().listPayments(
        filters as any,
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        status: 200,
        success: true,
        data: payments
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: error.message
      });
    }
  }
} 

