import { IsString, IsNumber, IsEnum, IsOptional, IsObject, Min } from 'class-validator';
import { PaymentMethod } from '../../enum/PaymentMethodEnum.js';
import { PaymentCurrency } from '../../enum/PaymentCurrencyEnum.js';
import { ICreatePaymentRequest } from '../../interface/request/ICreatePaymentRequest.js';

export class CreatePaymentDto implements ICreatePaymentRequest {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(PaymentCurrency)
  currency: PaymentCurrency;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  constructor(data: ICreatePaymentRequest) {
    this.amount = data.amount;
    this.currency = data.currency;
    this.paymentMethod = data.paymentMethod;
    this.description = data.description;
    this.metadata = data.metadata;
  }
} 