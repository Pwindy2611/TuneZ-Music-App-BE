import { firestore } from '../config/firebase/FireBaseConfig.js';
import { CollectionReference, Query } from 'firebase-admin/firestore';
import { Payment } from '../interface/model/Payment.js';
import { PaymentStatus } from '../enum/PaymentStatus.js';

export class PaymentRepository {
  private static readonly COLLECTION_NAME = 'payments';

  static async findById(orderId: string): Promise<Payment | null> {
    try {
      const docRef = firestore.collection(this.COLLECTION_NAME).doc(orderId);
      const docSnap = await docRef.get();
      
      if (!docSnap.exists) {
        return null;
      }

      return docSnap.data() as Payment;
    } catch (error) {
      console.error('Find Payment Error:', error);
      throw new Error('Failed to find payment');
    }
  }

  static async create(payment: Payment): Promise<void> {
    try {
      const docRef = firestore.collection(this.COLLECTION_NAME).doc(payment.orderId);
      await docRef.set({
        ...payment,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Create Payment Error:', error);
      throw new Error('Failed to create payment');
    }
  }

  static async updateStatus(orderId: string, status: string): Promise<void> {
    try {
      // Validate status
      if (!Object.values(PaymentStatus).includes(status as PaymentStatus)) {
        throw new Error('Invalid payment status');
      }

      const docRef = firestore.collection(this.COLLECTION_NAME).doc(orderId);
      await docRef.update({
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Update Payment Status Error:', error);
      throw new Error('Failed to update payment status');
    }
  }

  static async list(filters?: Record<string, any>, page: number = 1, limit: number = 10): Promise<{
    items: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      let queryRef: CollectionReference | Query = firestore.collection(this.COLLECTION_NAME);
      
      // Apply filters if any
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          queryRef = queryRef.where(key, '==', value);
        });
      }

      const querySnapshot = await queryRef.get();
      const total = querySnapshot.size;
      const totalPages = Math.ceil(total / limit);
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const items = querySnapshot.docs
        .slice(startIndex, endIndex)
        .map(doc => doc.data() as Payment);

      return {
        items,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('List Payments Error:', error);
      throw new Error('Failed to list payments');
    }
  }
} 