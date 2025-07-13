// src/components/AddProduct.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import { createProduct } from '../utils';
import type { Product } from '../types';
import { useNavigate } from 'react-router-dom';

// Example Pexels image (replace with one from your pre-loaded set if known)
const DEFAULT_IMAGE = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'; // Placeholder Pexels image

const AddProduct = () => {
  const [product, setProduct] = useState<Omit<Product, 'id'>>({
    category: 'Electronics',
    title: '',
    description: '',
    price: 0,
    image: DEFAULT_IMAGE, // Pexels default
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === 'price' ? parseFloat(value) : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({ ...product, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(product as Product);
      alert('Product added!');
      setProduct({
        category: 'Electronics',
        title: '',
        description: '',
        price: 0,
        image: DEFAULT_IMAGE, // Reset to Pexels default
      });
      navigate('/products');
    } catch (err: unknown) {
      const error = err as { message: string };
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <select name="category" value={product.category} onChange={handleChange}>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
          <option value="Accessories">Accessories</option>
        </select>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={product.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Add Product</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default AddProduct;