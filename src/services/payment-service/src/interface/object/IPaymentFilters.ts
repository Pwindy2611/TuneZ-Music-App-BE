export interface IPaymentFilters {
    status?: string;
    dateFrom?: Date; 
    dateTo?: Date;
    amountMin?: number; 
    amountMax?: number; 
  }