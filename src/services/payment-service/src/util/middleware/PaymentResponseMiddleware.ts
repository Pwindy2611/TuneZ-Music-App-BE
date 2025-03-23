import { Request, Response, NextFunction } from 'express';
import { PaymentStatus } from '../../enum/PaymentStatus.js';
import { IPaymentRequest } from '../../interface/request/IPaymentRequest.js';

export const handlePaymentResponse = (req: IPaymentRequest, res: Response, next: NextFunction) => {
  const paymentResponse = req.paymentResponse;

  if (!paymentResponse) {
    return next();
  }

  switch (paymentResponse.status) {
    case PaymentStatus.SUCCESS:
      res.status(200).json({
        status: 200,
        success: true,
        data: paymentResponse
      });
      break;
    case PaymentStatus.CANCELLED:
      res.status(400).json({
        status: 400,
        success: false,
        message: 'Payment was cancelled',
        data: paymentResponse
      });
      break;
    case PaymentStatus.FAILED:
      res.status(400).json({
        status: 400,
        success: false,
        message: 'Payment failed',
        data: paymentResponse
      });
      break;
    case PaymentStatus.PENDING:
      res.status(202).json({
        status: 202,
        success: true,
        message: 'Payment is being processed',
        data: paymentResponse
      });
      break;
    default:
      res.status(500).json({
        status: 500,
        success: false,
        message: 'Unknown payment status',
        data: paymentResponse
      });
  }
}; 