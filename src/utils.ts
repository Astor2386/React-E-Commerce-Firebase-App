// src/utils.ts
import { collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { Product, CartItem, Order } from './types';

// Define User type
interface UserData {
  uid: string;
  email: string;
  name: string;
  address: string;
  createdAt: string;
}

export const fetchProducts = async (category?: string): Promise<Product[]> => {
  try {
    const q = category ? query(collection(db, 'products'), where('category', '==', category)) : collection(db, 'products');
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
  } catch (err: unknown) {
    const error = err as { message: string };
    console.error('Fetch products error:', error.message);
    return [];
  }
};

export const fetchUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserData;
    }
    return null;
  } catch (err: unknown) {
    const error = err as { message: string };
    console.error('Fetch user data error:', error.message);
    return null;
  }
};

export const createUser = async (uid: string, email: string, name: string, address: string = ''): Promise<void> => {
  try {
    await addDoc(collection(db, 'users'), { uid, email, name, address, createdAt: new Date().toISOString() });
  } catch (err: unknown) {
    const error = err as { message: string };
    console.error('Create user error:', error.message);
    throw error;
  }
};

export const updateUser = async (uid: string, name: string, address: string): Promise<void> => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'users', querySnapshot.docs[0].id);
      await updateDoc(docRef, { name, address });
    }
  } catch (err: unknown) {
    const error = err as { message: string };
    console.error('Update user error:', error.message);
    throw error;
  }
};

export const deleteUser = async (uid: string): Promise<void> => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'users', querySnapshot.docs[0].id);
      await deleteDoc(docRef);
    }
  } catch (err: unknown) {
    const error = err as { message: string };
    console.error('Delete user error:', error.message);
    throw error;
  }
};

export const fetchOrders = async (uid: string): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
  } catch (err: unknown) {
    const error = err as { message: string };
    console.error('Fetch orders error:', error.message);
    return [];
  }
};

export const createOrder = async (userId: string, products: CartItem[], totalPrice: number): Promise<void> => {
  try {
    await addDoc(collection(db, 'orders'), {
      userId,
      products: products.filter((item): item is CartItem & { id: string } => !!item.id).map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      createdAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const error = err as { message: string };
    console.error('Create order error:', error.message);
    throw error;
  }
};

export const createProduct = async (product: Product): Promise<void> => {
  try {
    await addDoc(collection(db, 'products'), product);
  } catch (err: unknown) {
    const error = err as { message: string };
    console.error('Create product error:', error.message);
    throw error;
  }
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'products', id), data);
  } catch (err: unknown) {
    const error = err as { message: string };
    console.error('Update product error:', error.message);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (err: unknown) {
    const error = err as { message: string };
    console.error('Delete product error:', error.message);
    throw error;
  }
};