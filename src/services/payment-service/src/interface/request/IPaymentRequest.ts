import { Request } from 'express';
import { PaymentMethod } from "../../enum/PaymentMethod.js";

export interface IPaymentRequest extends Request {
    paymentMethod?: PaymentMethod;
    paymentResponse?: any;
  }