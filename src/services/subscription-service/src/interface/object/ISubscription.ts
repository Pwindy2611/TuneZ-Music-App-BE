export interface ISubscription {
    name: string;
    description: string;
    price: number;
    duration: number;
    features: string[];
    createdAt?: string;
    updatedAt?: string;
}