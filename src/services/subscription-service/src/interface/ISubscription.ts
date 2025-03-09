export interface ISubscription {
    name: string;
    description: string;
    price: number;
    currency: string;
    features: string[];
    createdAt: Date;
    updatedAt: Date;
}