import { PaymentMethod } from "../../enum/PaymentMethod.js";
import {Request} from "express";

export interface IPaymentRequest extends Request {
    paymentMethod?: PaymentMethod;
    paymentResponse?: any;
  }