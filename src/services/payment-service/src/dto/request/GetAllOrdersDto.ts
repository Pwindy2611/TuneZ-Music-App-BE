import { IsOptional, IsString, IsNumber, IsEnum, validateOrReject } from 'class-validator';
import { PaymentStatus } from '../../enum/PaymentStatus.js';
import { PaymentMethod } from '../../enum/PaymentMethod.js';

export class GetAllOrdersDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus;

    @IsOptional()
    @IsEnum(PaymentMethod)
    paymentMethod?: PaymentMethod;

    @IsOptional()
    @IsNumber()
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    limit?: number = 10;

    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;

    constructor(data: Partial<GetAllOrdersDto>) {
        Object.assign(this, data);
    }

    async validate() {
        try {
            await validateOrReject(this);
        } catch (errors) {
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
    }
} 