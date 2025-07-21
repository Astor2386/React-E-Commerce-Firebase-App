import { render, screen, act } from '@testing-library/react'; // Removed unused fireEvent
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../redux/store';
import ShoppingCart from '../components/ShoppingCart';
import { addToCart } from '../redux/cartSlice';
import '@testing-library/jest-dom';

test('renders ShoppingCart', async () => {
  await act(async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ShoppingCart />
        </BrowserRouter>
      </Provider>
    );
  });
  expect(screen.getByText(/Shopping Cart/i)).toBeInTheDocument();
});

test('updates cart when adding a product', async () => {
  const product = {
    id: '1',
    category: 'Electronics',
    title: 'Test',
    description: 'A test product', // Added missing description
    price: 10,
    image: '',
    quantity: 1,
  };

  // Initial state should be empty
  expect(store.getState().cart.totalItems).toBe(0);
  expect(store.getState().cart.totalPrice).toBe(0);

  // Dispatch addToCart
  await act(async () => {
    store.dispatch(addToCart(product));
  });

  // Render the component after state change
  await act(async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ShoppingCart />
        </BrowserRouter>
      </Provider>
    );
  });

  // Assert state updates
  const state = store.getState();
  expect(state.cart.totalItems).toBe(1);
  expect(state.cart.totalPrice).toBe(10);
  expect(screen.getByText(/Test/i)).toBeInTheDocument(); // Check if product title appears
  expect(screen.getByText(/Price: \$10/i)).toBeInTheDocument(); // More specific query for item price
  expect(screen.getByText(/Total:.*\$10\.00/i)).toBeInTheDocument(); // toBeInTheDocument is by far the most useful tool during this testing

  // Add another item and verify
  await act(async () => {
    store.dispatch(addToCart(product));
  });

  const updatedState = store.getState();
  expect(updatedState.cart.totalItems).toBe(2);
  expect(updatedState.cart.totalPrice).toBe(20);
  expect(screen.getByText(/Total:.*\$20\.00/i)).toBeInTheDocument(); // Updated total with regex
});