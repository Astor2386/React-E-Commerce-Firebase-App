import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../redux/store';
import ProductList from '../components/ProductList';
import '@testing-library/jest-dom'; // Added to provide toBeInTheDocument

jest.mock('../utils', () => ({
  fetchProducts: jest.fn().mockResolvedValue([
    { id: '1', price: 10, category: 'Electronics' },
  ]),
}));

test('renders ProductList with products', async () => {
  await act(async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>
      </Provider>
    );
  });
  const electronicsElements = await screen.findAllByText(/Electronics/i);
  expect(electronicsElements).toHaveLength(2); // Expect 2 matches (option and product)
  expect(await screen.findByText(/10/)).toBeInTheDocument(); // Check price
});
// ^ @description — Assert whether an element is present in the document or not. Super helfpul work around - toBeInTheDocument
test('adds product to cart', async () => {
  await act(async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>
      </Provider>
    );
  });
  const addToCartButton = await screen.findByText('Add to Cart');
  act(() => {
    fireEvent.click(addToCartButton);
  });
  const state = store.getState();
  expect(state.cart.items).toHaveLength(1);
});