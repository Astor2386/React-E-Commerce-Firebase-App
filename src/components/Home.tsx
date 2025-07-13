// src/components/Home.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import type { User } from 'firebase/auth';

const Home = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setCurrentUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Welcome to the E-Commerce App!</h2>
      {currentUser ? (
        <p>Hello, {currentUser.displayName || currentUser.email}! Explore our products.</p>
      ) : (
        <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to start shopping.</p>
      )}
    </div>
  );
};

export default Home;