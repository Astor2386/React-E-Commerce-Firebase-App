// src/components/ProductList.tsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts, updateProduct, deleteProduct } from '../utils';
import type { Product } from '../types';
import { Link } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';

const ProductList = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Partial<Product>>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // State for category filter

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(selectedCategory === 'All' ? undefined : selectedCategory);
        setProducts(data);
      } catch (err: unknown) {
        const error = err as { message: string };
        setError(error.message);
      }
    };
    loadProducts();
  }, [selectedCategory]);

  const handleEdit = (product: Product) => {
    if (product.id) {
      setEditProductId(product.id);
      setUpdatedProduct({
        category: product.category,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
      });
    } else {
      setError('Product ID is missing');
    }
  };

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedProduct({
      ...updatedProduct,
      [name]: name === 'price' ? parseFloat(value) : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedProduct({ ...updatedProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      await updateProduct(id, updatedProduct);
      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, ...updatedProduct } : p
        ) as Product[]
      );
      setEditProductId(null);
      alert('Product updated!');
    } catch (err: unknown) {
      const error = err as { message: string };
      setError(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
        alert('Product deleted!');
      } catch (err: unknown) {
        const error = err as { message: string };
        setError(error.message);
      }
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div>
      <h2>Products</h2>
      <div>
        <label htmlFor="category-filter">Filter by Category: </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="All">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>
      <Link to="/add-product">Add New Product</Link>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-item">
              {editProductId === product.id ? (
                <form onSubmit={(e) => handleUpdate(e, product.id!)}>
                  <select
                    name="category"
                    value={updatedProduct.category || product.category}
                    onChange={handleUpdateChange}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                  <input
                    type="text"
                    name="title"
                    value={updatedProduct.title || product.title}
                    onChange={handleUpdateChange}
                  />
                  <input
                    type="text"
                    name="description"
                    value={updatedProduct.description || product.description}
                    onChange={handleUpdateChange}
                  />
                  <input
                    type="number"
                    name="price"
                    value={updatedProduct.price || product.price}
                    onChange={handleUpdateChange}
                  />
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditProductId(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <div>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ maxWidth: '100px' }}
                  />
                  <h3>{product.title}</h3>
                  <p>Category: {product.category}</p>
                  <p>Price: ${product.price}</p>
                  <p>{product.description}</p>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button
                    style={{ backgroundColor: 'crimson', marginLeft: '10px' }}
                    onClick={() => handleDelete(product.id!)}
                  >
                    Delete
                  </button>
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ProductList;