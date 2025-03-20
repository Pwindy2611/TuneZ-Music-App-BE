import { IsEnum, IsOptional, IsObject } from 'class-validator';
import { PaymentStatus } from '../../enum/PaymentStatusEnum.js';
import { IUpdatePaymentStatusRequest } from '../../interface/request/IUpdatePaymentStatusRequest.js';

export class UpdatePaymentStatusDto implements IUpdatePaymentStatusRequest {
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  constructor(data: IUpdatePaymentStatusRequest) {
    this.status = data.status;
    this.metadata = data.metadata;
  }
} 