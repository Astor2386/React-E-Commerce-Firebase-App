// Creating a Navbar just for aesthetics and practical use
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import type { User } from 'firebase/auth';

interface NavbarProps {
  user?: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setCurrentUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert('Logged out successfully!');
    } catch (err: unknown) {
      const error = err as { message: string };
      console.error('Logout error:', error.message);
    }
  };

  return (
    <nav>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '15px', padding: '10px' }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        {user || currentUser ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/orders">Order History</Link></li>
            <li><Link to="/add-product">Add Product</Link></li>
            <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;