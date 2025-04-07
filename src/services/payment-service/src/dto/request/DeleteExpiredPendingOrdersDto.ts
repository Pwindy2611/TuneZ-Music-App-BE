import { IsOptional, IsNumber, validateOrReject } from 'class-validator';

export class DeleteExpiredPendingOrdersDto {
    @IsOptional()
    @IsNumber()
    minutesThreshold?: number = 20;

    constructor(data: Partial<DeleteExpiredPendingOrdersDto>) {
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