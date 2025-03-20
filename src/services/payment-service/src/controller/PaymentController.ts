import { Request, Response } from 'express';
import { IPaymentService } from '../interface/service/IPaymentService.js';
import { ICreatePaymentRequest } from '../interface/request/ICreatePaymentRequest.js';
import { IUpdatePaymentStatusRequest } from '../interface/request/IUpdatePaymentStatusRequest.js';

export class PaymentController {
  private paymentService: IPaymentService;

  constructor(paymentService: IPaymentService) {
    this.paymentService = paymentService;
  }

  async createPayment(req: Request, res: Response) {
    try {
      const paymentData: ICreatePaymentRequest = req.body;

      if (!paymentData.orderId || !paymentData.amount || !paymentData.paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const paymentResponse = await this.paymentService.createPayment(paymentData);

      return res.json({
        success: true,
        data: paymentResponse
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async handlePaymentCallback(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const callbackData = req.body;

      const paymentResponse = await this.paymentService.verifyPaymentCallback(
        paymentId,
        callbackData
      );

      return res.json({
        success: true,
        data: paymentResponse
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const updateData: IUpdatePaymentStatusRequest = req.body;

      const paymentResponse = await this.paymentService.updatePaymentStatus(
        paymentId,
        updateData
      );

      return res.json({
        success: true,
        data: paymentResponse
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async cancelPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;

      const paymentResponse = await this.paymentService.cancelPayment(paymentId);

      return res.json({
        success: true,
        data: paymentResponse
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async refundPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const { amount } = req.body;

      const paymentResponse = await this.paymentService.refundPayment(
        paymentId,
        amount
      );

      return res.json({
        success: true,
        data: paymentResponse
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;

      const paymentResponse = await this.paymentService.getPayment(paymentId);

      return res.json({
        success: true,
        data: paymentResponse
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async listPayments(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;

      const payments = await this.paymentService.listPayments(
        filters as any,
        Number(page),
        Number(limit)
      );

      return res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
} 

