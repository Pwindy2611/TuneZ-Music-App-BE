import { firestore } from '../config/firebase/FireBaseConfig.js';
import { CollectionReference, Query, Timestamp } from 'firebase-admin/firestore';
import { Payment } from '../interface/model/Payment.js';
import { PaymentStatus } from '../enum/PaymentStatus.js';
import { GetAllOrdersDto } from '../dto/request/GetAllOrdersDto.js';
import { DeleteExpiredPendingOrdersDto } from '../dto/request/DeleteExpiredPendingOrdersDto.js';

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
  static async delete(orderId: string): Promise<void> {
    try {
      const docRef = firestore.collection(this.COLLECTION_NAME).doc(orderId);
      await docRef.delete();
    } catch (error) {
      console.error('Delete Payment Error:', error);
      throw new Error('Failed to delete payment');
    }
  }
  static async updateStatus(orderId: string, status: string): Promise<void> {
    try {
      if (!Object.values(PaymentStatus).includes(status as PaymentStatus)) {
        return  Promise.reject(new Error('Invalid payment status'));
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
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          queryRef = queryRef.where(key, '==', value);
        });
      }

      const querySnapshot = await queryRef.get();
      const total = querySnapshot.size;
      const totalPages = Math.ceil(total / limit);
      
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

  static async getAllOrders(filters: GetAllOrdersDto): Promise<{
    items: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      let queryRef: CollectionReference | Query = firestore.collection(this.COLLECTION_NAME);
      
      if (filters.status) {
        queryRef = queryRef.where('status', '==', filters.status);
      }

      if (filters.paymentMethod) {
        queryRef = queryRef.where('method', '==', filters.paymentMethod);
      }

      if (filters.startDate) {
        queryRef = queryRef.where('createdAt', '>=', Timestamp.fromDate(new Date(filters.startDate)));
      }

      if (filters.endDate) {
        queryRef = queryRef.where('createdAt', '<=', Timestamp.fromDate(new Date(filters.endDate)));
      }

      const querySnapshot = await queryRef.get();
      let items = querySnapshot.docs.map(doc => doc.data() as Payment);

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        items = items.filter(payment => 
          payment.orderId.toLowerCase().includes(searchTerm) ||
          payment.referenceId.toLowerCase().includes(searchTerm)
        );
      }

      const total = items.length;
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const totalPages = Math.ceil(total / limit);
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      items = items.slice(startIndex, endIndex);

      return {
        items,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Get All Orders Error:', error);
      throw new Error('Failed to get all orders');
    }
  }

  static async deleteExpiredPendingOrders(filters: DeleteExpiredPendingOrdersDto): Promise<{
    deletedCount: number;
    deletedOrders: Payment[];
  }> {
    try {
      const minutesThreshold = filters.minutesThreshold || 20;
      const thresholdDate = new Date();
      thresholdDate.setMinutes(thresholdDate.getMinutes() - minutesThreshold);

      // Query các order PENDING
      const queryRef = firestore.collection(this.COLLECTION_NAME)
        .where('status', '==', PaymentStatus.PENDING);

      const querySnapshot = await queryRef.get();
      const pendingOrders = querySnapshot.docs.map(doc => doc.data() as Payment);

      // Lọc các order đã quá thời gian
      const expiredOrders = pendingOrders.filter(order => {
        const orderDate = order.createdAt instanceof Timestamp 
          ? order.createdAt.toDate() 
          : new Date(order.createdAt);
        return orderDate <= thresholdDate;
      });

      // Xóa các order đã hết hạn
      const deletePromises = querySnapshot.docs
        .filter(doc => expiredOrders.some(order => order.orderId === doc.id))
        .map(doc => doc.ref.delete());

      await Promise.all(deletePromises);

      return {
        deletedCount: expiredOrders.length,
        deletedOrders: expiredOrders
      };
    } catch (error) {
      console.error('Delete Expired Pending Orders Error:', error);
      throw new Error('Failed to delete expired pending orders');
    }
  }
} 