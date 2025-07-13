// src/components/ShoppingCart.tsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import type { CartItem, Product } from '../types';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { removeFromCart, clearCart } from '../redux/cartSlice';

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const productPromises = cart.items
        .filter((item): item is CartItem & { id: string } => !!item.id) // Type guard
        .map(async (item) => {
          const productDoc = await getDoc(doc(db, 'products', item.id));
          return { id: productDoc.id, ...productDoc.data() } as Product;
        });
      const productArray = await Promise.all(productPromises);
      setProducts(productArray);
    };
    fetchProducts();
  }, [cart.items]);

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      alert('Please log in to checkout.');
      navigate('/login');
      return;
    }

    try {
      const totalPrice = cart.totalPrice;
      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser.uid,
        products: cart.items
          .filter((item): item is CartItem & { id: string } => !!item.id)
          .map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        totalPrice,
        createdAt: new Date().toISOString(),
      });

      alert('Order placed!');
      dispatch(clearCart());
      navigate('/orders');
    } catch (err: unknown) {
      const error = err as { message: string };
      console.error('Checkout error:', error.message);
    }
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.items.length > 0 ? (
        <>
          {cart.items.map((item, index) => (
            item.id ? ( // Type guard for rendering
              <div key={item.id} className="cart-item">
                <img
                  src={products[index]?.image || item.image}
                  alt={products[index]?.title || item.title}
                  style={{ maxWidth: '50px' }}
                />
                <p>{products[index]?.title || item.title}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
                <button
                  onClick={() => item.id && handleRemove(item.id)} // Type guard for handleRemove
                >
                  Remove
                </button>
              </div>
            ) : null
          ))}
          <p>Total: ${cart.totalPrice.toFixed(2)}</p>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default ShoppingCart;