// src/tests/Home.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import { auth } from '../firebaseConfig'; // Import to mock
import '@testing-library/jest-dom';

jest.mock('../firebaseConfig', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders Home component for logged-out user', async () => {
  // Mock onAuthStateChanged to simulate no user
  (auth.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
    setTimeout(() => callback(null), 0); // Simulate async behavior
    return jest.fn(); // Return unsubscribe function
  });

  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  // Wait for the effect to apply and check the welcome message
  await waitFor(() => {
    expect(screen.getByText('Welcome to the E-Commerce App!')).toBeInTheDocument();
  });

  // Target the <p> element with a precise matcher
  await waitFor(() => {
    const paragraph = screen.getByText((_, element) => {
      return (
        element?.tagName?.toLowerCase() === 'p' &&
        element?.textContent?.trim() === 'Please login or register to start shopping.'
      );
    });
    expect(paragraph).toBeInTheDocument();
  });

  expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
  expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute('href', '/register');
});

test('renders Home component for logged-in user', async () => {
  const mockUser = {
    displayName: 'Test User',
    email: 'test@example.com',
  };
  (auth.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
    setTimeout(() => callback(mockUser), 0); // Simulate async behavior
    return jest.fn(); // Return unsubscribe function
  });

  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  // Wait for the effect to apply and check the welcome message
  await waitFor(() => {
    expect(screen.getByText('Welcome to the E-Commerce App!')).toBeInTheDocument();
  });

  // Target the <p> element with a precise matcher
  await waitFor(() => {
    const paragraph = screen.getByText((_, element) => {
      return (
        element?.tagName?.toLowerCase() === 'p' &&
        element?.textContent?.trim() === 'Hello, Test User! Explore our products.'
      );
    });
    expect(paragraph).toBeInTheDocument();
  });
});