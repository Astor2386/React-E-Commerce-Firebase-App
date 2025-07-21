// ShoppingCart.tsx
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/cartSlice';
import type { RootState } from '../redux/store';
import { Link } from 'react-router-dom';

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty. <Link to="/products">Continue shopping</Link></p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} style={{ margin: '10px 0', border: '1px solid #ccc', padding: '10px' }}>
              <h3>{item.title}</h3>
              <p>Price: ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => handleRemove(item.id!)}>Remove</button>
            </div>
          ))}
          <div>
            <h3>Total: {totalItems} items, ${totalPrice.toFixed(2)}</h3>
            <button>Checkout</button> {/* Placeholder for checkout logic */}
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;