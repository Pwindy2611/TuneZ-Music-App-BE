export interface ISubscription {
    id?: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    features: string[];
    createdAt?: string;
    updatedAt?: string;
}