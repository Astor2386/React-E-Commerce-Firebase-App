import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ShoppingCart from './components/ShoppingCart';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import OrderHistory from './components/OrderHistory';
import AddProduct from './components/AddProduct';
import Home from './components/Home';

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar user={user} /> {/* Prop now matches NavbarProps */}
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={user ? <UserProfile /> : <Login />} />
            <Route path="/orders" element={user ? <OrderHistory /> : <Login />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;