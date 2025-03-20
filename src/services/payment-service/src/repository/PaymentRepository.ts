import { firestore } from '../config/firebase/FireBaseConfig.js';
import { CollectionReference, Query } from 'firebase-admin/firestore';
import { Payment } from '../interface/model/Payment.js';

export class PaymentRepository {
  private static readonly COLLECTION_NAME = 'payments';

  static async findById(id: string): Promise<Payment | null> {
    const docRef = firestore.collection(this.COLLECTION_NAME).doc(id);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return null;
    }

    return docSnap.data() as Payment;
  }

  static async create(payment: Payment): Promise<void> {
    const docRef = firestore.collection(this.COLLECTION_NAME).doc(payment.id);
    await docRef.set({
      ...payment,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  static async updateStatus(id: string, status: string): Promise<void> {
    const docRef = firestore.collection(this.COLLECTION_NAME).doc(id);
    await docRef.update({
      status,
      updatedAt: new Date()
    });
  }

  static async list(filters?: Record<string, any>, page: number = 1, limit: number = 10): Promise<{
    items: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
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
  }
} 