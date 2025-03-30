import { Router, Request, Response, NextFunction } from 'express';
import { PaymentController } from '../controller/PaymentController.js';
import { PaymentServiceFactory } from '../service/PaymentServiceFactory.js';
import { PaymentMethod } from '../enum/PaymentMethod.js';
import { PaymentRepository } from '../repository/PaymentRepository.js';
import { authMiddleware } from '../util/middleware/AuthMiddleware.js';
import { handlePaymentResponse } from '../util/middleware/PaymentResponseMiddleware.js';
import { IPaymentRequest } from '../interface/request/IPaymentRequest.js';
const router = Router();
const paymentController = PaymentController.getInstance();

const getPaymentMethod = async (req: IPaymentRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orderId =req.query.orderId as string || req.body.orderId;
    
    if (!orderId) {
      res.status(400).json({ 
        success: false,
        message: 'Missing orderId parameter' 
      });
      return;
    }

    const payment = await PaymentRepository.findById(orderId);
    
    if (!payment) {
      res.status(404).json({ 
        success: false,
        message: 'Payment not found' 
      });
      return;
    }

    req.paymentMethod = payment.method;
    next();
  } catch (error) {
    console.error('Get Payment Method Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting payment method'
    });
  }
};

router.post('/create', authMiddleware, async (req: Request, res: Response) => {
  const { paymentMethod } = req.body;
  const paymentService = PaymentServiceFactory.createPaymentService(paymentMethod);
  paymentController.setPaymentService(paymentService);
  await paymentController.createPayment(req, res);
});

router.post('/callback', getPaymentMethod, async (req: IPaymentRequest, res: Response, next: NextFunction) => {
  const paymentService = PaymentServiceFactory.createPaymentService(req.paymentMethod!);
  paymentController.setPaymentService(paymentService);
  await paymentController.handlePaymentCallback(req, res, next);
},handlePaymentResponse);

router.get('/getPayment', getPaymentMethod, async (req: IPaymentRequest, res: Response) => {
  const paymentService = PaymentServiceFactory.createPaymentService(req.paymentMethod!);
  paymentController.setPaymentService(paymentService);
  await paymentController.getPayment(req, res);
});

router.patch('/updatePayment/:id/status', getPaymentMethod, async (req: IPaymentRequest, res: Response) => {
  const paymentService = PaymentServiceFactory.createPaymentService(req.paymentMethod!);
  paymentController.setPaymentService(paymentService);
  await paymentController.updatePaymentStatus(req, res);
});

router.post('/cancelPayment/:id', getPaymentMethod, async (req: IPaymentRequest, res: Response) => {
  const paymentService = PaymentServiceFactory.createPaymentService(req.paymentMethod!);
  paymentController.setPaymentService(paymentService);
  await paymentController.cancelPayment(req, res);
});

router.post('/refundPayment/:id', getPaymentMethod, async (req: IPaymentRequest, res: Response) => {
  const paymentService = PaymentServiceFactory.createPaymentService(req.paymentMethod!);
  paymentController.setPaymentService(paymentService);
  await paymentController.refundPayment(req, res);
});

router.get('/listPayments', async (req: Request, res: Response) => {
  const paymentService = PaymentServiceFactory.createPaymentService(PaymentMethod.MOMO);
  paymentController.setPaymentService(paymentService);
  await paymentController.listPayments(req, res);
});

export default router;