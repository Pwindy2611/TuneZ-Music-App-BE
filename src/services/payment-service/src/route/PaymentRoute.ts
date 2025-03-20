import { Router, Request, Response, NextFunction } from 'express';
import { PaymentController } from '../controller/PaymentController.js';
import { PaymentServiceFactory } from '../service/PaymentServiceFactory.js';
import { PaymentMethod } from '../enum/PaymentMethod.js';
import { PaymentRepository } from '../repository/PaymentRepository.js';

// Mở rộng Request của Express
interface PaymentRequest extends Request {
  paymentMethod?: PaymentMethod;
}

const router = Router();

// Middleware để lấy payment method từ database
const getPaymentMethod = async (req: PaymentRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paymentId = req.params.id;
    const payment = await PaymentRepository.findById(paymentId);
    
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
    res.status(500).json({
      success: false,
      message: 'Error getting payment method'
    });
  }
};

// Create payment
router.post('/create', async (req: Request, res: Response) => {
  const { paymentMethod } = req.body;
  const paymentService = PaymentServiceFactory.createPaymentService(paymentMethod);
  const paymentController = new PaymentController(paymentService);
  await paymentController.createPayment(req, res);
});

// Get payment by ID
router.get('/:id', getPaymentMethod, async (req: PaymentRequest, res: Response) => {
  const paymentService = PaymentServiceFactory.createPaymentService(req.paymentMethod!);
  const paymentController = new PaymentController(paymentService);
  await paymentController.getPayment(req, res);
});

// Update payment status
router.patch('/:id/status', getPaymentMethod, async (req: PaymentRequest, res: Response) => {
  const paymentService = PaymentServiceFactory.createPaymentService(req.paymentMethod!);
  const paymentController = new PaymentController(paymentService);
  await paymentController.updatePaymentStatus(req, res);
});

// Cancel payment
router.post('/:id/cancel', getPaymentMethod, async (req: PaymentRequest, res: Response) => {
  const paymentService = PaymentServiceFactory.createPaymentService(req.paymentMethod!);
  const paymentController = new PaymentController(paymentService);
  await paymentController.cancelPayment(req, res);
});

// Refund payment
router.post('/:id/refund', getPaymentMethod, async (req: PaymentRequest, res: Response) => {
  const paymentService = PaymentServiceFactory.createPaymentService(req.paymentMethod!);
  const paymentController = new PaymentController(paymentService);
  await paymentController.refundPayment(req, res);
});

// List payments
router.get('/', async (req: Request, res: Response) => {
  const paymentService = PaymentServiceFactory.createPaymentService(PaymentMethod.MOMO); // Tạm thời giữ MOMO vì list không cần payment method
  const paymentController = new PaymentController(paymentService);
  await paymentController.listPayments(req, res);
});

// Handle payment callback
router.post('/callback/:id', getPaymentMethod, async (req: PaymentRequest, res: Response) => {
  const paymentService = PaymentServiceFactory.createPaymentService(req.paymentMethod!);
  const paymentController = new PaymentController(paymentService);
  await paymentController.handlePaymentCallback(req, res);
});

export default router;