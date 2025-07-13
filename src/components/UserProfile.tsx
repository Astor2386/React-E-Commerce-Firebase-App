// src/components/UserProfile.tsx
import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore'; // Added deleteDoc
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const q = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setName(userData.name || '');
          setAddress(userData.address || '');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.currentUser) {
      try {
        const userDoc = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(userDoc);
        if (!querySnapshot.empty) {
          const docRef = doc(db, 'users', querySnapshot.docs[0].id);
          await updateDoc(docRef, { name, address });
          alert('Profile updated!');
        }
      } catch (err: unknown) {
        const error = err as { message: string };
        setError(error.message);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      if (auth.currentUser) {
        try {
          const userDoc = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
          const querySnapshot = await getDocs(userDoc);
          if (!querySnapshot.empty) {
            const docRef = doc(db, 'users', querySnapshot.docs[0].id);
            await deleteDoc(docRef); // Now recognized
          }
          await auth.currentUser.delete();
          alert('Account deleted!');
          navigate('/login');
        } catch (err: unknown) {
          const error = err as { message: string };
          setError(error.message);
        }
      }
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="submit">Update</button>
        <button
          type="button"
          onClick={handleDeleteAccount}
          style={{ backgroundColor: 'crimson', marginLeft: '10px' }}
        >
          Delete Account
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default UserProfile;