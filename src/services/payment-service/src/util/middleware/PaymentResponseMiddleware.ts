import { Response, NextFunction } from 'express';
import { PaymentStatus } from '../../enum/PaymentStatus.js';
import { IPaymentRequest } from '../../interface/request/IPaymentRequest.js';
import {PaymentRepository} from "../../repository/PaymentRepository.js";
import {subscriptionServiceClient} from "../../grpc/client/GrpcClient.js";

export const handlePaymentResponse = async (req: IPaymentRequest, res: Response, next: NextFunction) => {
  const paymentResponse = req.paymentResponse;

  if (!paymentResponse) {
    res.status(400).json({
      message: 'Missing payment response',
      resultCode: 1
    });
    return;
  }

  const itemId = paymentResponse.metadata.itemId;
  const userId = paymentResponse.metadata.userId;

  try {
    switch (paymentResponse.status) {
      case PaymentStatus.SUCCESS:
        await processSuccessfulPayment(itemId, userId);
        // MoMo expects these specific response fields
        res.status(200).json({
          message: 'Success',
          resultCode: 0
        });
        break;

      case PaymentStatus.FAILED:
        await PaymentRepository.delete(paymentResponse.id);
        res.status(200).json({
          message: 'Transaction failed',
          resultCode: 1
        });
        break;

      case PaymentStatus.PENDING:
        res.status(200).json({
          message: 'Transaction pending',
          resultCode: 9000
        });
        break;

      default:
        res.status(200).json({
          message: 'Unknown status',
          resultCode: 1
        });
    }

    next();
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(200).json({
      message: error.message,
      resultCode: 1
    });
  }
};

async function processSuccessfulPayment(itemId: string, userId: string) {
  return new Promise((resolve, reject) => {
    console.log(`Checking subscription for itemId: ${itemId}`);

    subscriptionServiceClient.isSubscription({ id: itemId }, (error: any, response: any) => {
      if (error) {
        console.error('gRPC error in isSubscription:', error);
        reject(new Error(`Error checking subscription: ${error.message}`));
        return;
      };

      if (response.isSubscribed) {
        const subscriptionId = itemId;
        subscriptionServiceClient.subscribe({ userId, subscriptionId}, (subError: any, subResponse: any) => {
          if (subError) {
            console.error('gRPC error in subscribe:', subError);
            reject(new Error(`Error subscribing: ${subError.message}`));
            return;
          }

          console.log('Subscribe response:', JSON.stringify(subResponse));
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  });
}
