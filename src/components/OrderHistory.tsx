// src/components/OrderHistory.tsx
import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../types';

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (auth.currentUser) {
        try {
          const q = query(collection(db, 'orders'), where('userId', '==', auth.currentUser.uid));
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Order[];
          setOrders(ordersData);
        } catch (err: unknown) {
          const error = err as { message: string };
          setError(error.message);
        }
      } else {
        navigate('/login');
      }
    };
    fetchOrders();
  }, [navigate]);

  const handleViewDetails = async (orderId: string) => {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    if (orderDoc.exists()) {
      setSelectedOrder({ id: orderDoc.id, ...orderDoc.data() } as Order);
    }
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div>
      <h2>Order History</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders.length > 0 ? (
        <>
          {orders.map((order) => (
            <div key={order.id} style={{ margin: '10px 0', border: '1px solid #ccc', padding: '10px' }}>
              <p>Order ID: {order.id}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
              <button onClick={() => handleViewDetails(order.id)}>View Details</button>
            </div>
          ))}
          {selectedOrder && (
            <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '10px' }}>
              <h3>Order Details - ID: {selectedOrder.id}</h3>
              <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              <p>Total Price: ${selectedOrder.totalPrice.toFixed(2)}</p>
              <h4>Products:</h4>
              <ul>
                {selectedOrder.products.map((item, index) => (
                  <li key={index}>
                    Product ID: {item.productId}, Quantity: {item.quantity}, Price: ${item.price}
                  </li>
                ))}
              </ul>
              <button onClick={handleCloseDetails}>Close</button>
            </div>
          )}
        </>
      ) : (
        <p>No orders found. Start shopping!</p>
      )}
    </div>
  );
};

export default OrderHistory;