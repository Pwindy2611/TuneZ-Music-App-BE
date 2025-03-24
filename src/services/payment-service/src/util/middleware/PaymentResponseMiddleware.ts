import { Request, Response, NextFunction } from 'express';
import { PaymentStatus } from '../../enum/PaymentStatus.js';
import { IPaymentRequest } from '../../interface/request/IPaymentRequest.js';
import {PaymentRepository} from "../../repository/PaymentRepository.js";
import {subscriptionServiceClient} from "../../grpc/client/GrpcClient.js";

export const handlePaymentResponse = async (req: IPaymentRequest, res: Response, next: NextFunction) => {
  const paymentResponse = req.paymentResponse;
  const itemId = paymentResponse.itemId;
  const userId = paymentResponse.userId;
  if (!paymentResponse) {
    return next();
  }

  switch (paymentResponse.status) {

    case PaymentStatus.SUCCESS:
      subscriptionServiceClient.IsSubscription({ id: itemId }, (error: any, response: any) => {
        if (error) {
          res.status(500).json({
            status: 500,
            success: false,
            message: `Error checking subscription: ${error.message}`,
          });
          return;
        }

        if (response.isSubscribed) {
          subscriptionServiceClient.subscribe({ userId , subscriptionId: itemId }, (error: any, response: any) => {
            if (error) {
              res.status(500).json({
                status: 500,
                success: false,
                message: `Error subscribing: ${error.message}`,
              });
              return;
            }
          });
        }

        //TODO: IMPLEMENT LOGIC PRODUCT


        res.status(200).json({
          status: 200,
          success: true,
          data: paymentResponse,
        });
      });
      break;
    case PaymentStatus.FAILED:
      await PaymentRepository.delete(paymentResponse.id);
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