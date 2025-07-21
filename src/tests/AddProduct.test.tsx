import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import AddProduct from '../components/AddProduct';
import { createProduct } from '../utils';
import { store } from '../redux/store';
import '@testing-library/jest-dom';

// Mock Firebase and utils
jest.mock('../utils', () => ({
  createProduct: jest.fn().mockResolvedValue({ id: 'test-id' }),
}));
jest.mock('../firebaseConfig', () => ({
  auth: {
    currentUser: { uid: 'test-uid' }, // Mock a logged-in user
    onAuthStateChanged: jest.fn((callback) => callback({ uid: 'test-uid' })), // Simulate auth state change
  },
  db: {},
}));

// Mock react-router-dom with useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(), // Mock useNavigate
}));

let originalConsoleError: (...args: unknown[]) => void;

beforeEach(() => {
  (window.alert as jest.Mock) = jest.fn();
  originalConsoleError = console.error;
  console.error = (...args) => {
    originalConsoleError(...args);
    if (args.some(arg => arg.includes('error') || arg.includes('failed'))) {
      throw new Error('React error captured: ' + args.join(' '));
    }
  };
  // Configure useNavigate mock in beforeEach dependency is already installed from my prior project
  (jest.requireMock('react-router-dom').useNavigate as jest.Mock).mockReturnValue(jest.fn());
});

afterEach(() => {
  (window.alert as jest.Mock).mockRestore();
  jest.clearAllMocks();
  console.error = originalConsoleError;
});

test('renders AddProduct component and updates title', async () => {
  const mockNavigate = jest.fn();
  (jest.requireMock('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  let container;
  await act(async () => {
    const renderResult = render(
      <Provider store={store}>
        <BrowserRouter>
          <AddProduct />
        </BrowserRouter>
      </Provider>
    );
    container = renderResult.container;
    console.log('Rendered DOM:', container.innerHTML); // Debug the rendered output
  });

  await waitFor(() => {
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
  }, { timeout: 2000 });

  const titleInput = screen.getByPlaceholderText('Title') as HTMLInputElement;
  fireEvent.change(titleInput, { target: { value: 'Test Product' } });
  expect(titleInput.value).toBe('Test Product');
});

test('submits form successfully', async () => {
  const mockNavigate = jest.fn();
  (jest.requireMock('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  let container;
  await act(async () => {
    const renderResult = render(
      <Provider store={store}>
        <BrowserRouter>
          <AddProduct />
        </BrowserRouter>
      </Provider>
    );
    container = renderResult.container;
    console.log('Rendered DOM:', container.innerHTML); 
  });

  await waitFor(() => {
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
  }, { timeout: 2000 });

  const titleInput = screen.getByPlaceholderText('Title') as HTMLInputElement;
  fireEvent.change(titleInput, { target: { value: 'Test Product' } });
  fireEvent.click(screen.getByRole('button', { name: /add product/i }));

  await waitFor(() => {
    expect(createProduct).toHaveBeenCalledWith({
      category: 'Electronics',
      title: 'Test Product',
      description: '',
      price: 0,
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/products');
    expect(window.alert).toHaveBeenCalledWith('Product added!');
  }, { timeout: 2000 });
});

test('handles form submission error', async () => {
  const mockNavigate = jest.fn();
  (jest.requireMock('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  (createProduct as jest.Mock).mockRejectedValueOnce(new Error('Failed to create product'));

  let container;
  await act(async () => {
    const renderResult = render(
      <Provider store={store}>
        <BrowserRouter>
          <AddProduct />
        </BrowserRouter>
      </Provider>
    );
    container = renderResult.container;
    console.log('Rendered DOM:', container.innerHTML);
  });

  await waitFor(() => {
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
  }, { timeout: 2000 });

  const titleInput = screen.getByPlaceholderText('Title') as HTMLInputElement;
  fireEvent.change(titleInput, { target: { value: 'Test Product' } });
  fireEvent.click(screen.getByRole('button', { name: /add product/i }));

  await waitFor(() => {
    expect(screen.getByText(/Failed to create product/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  }, { timeout: 2000 });
});