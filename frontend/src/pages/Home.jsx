import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const categories = [
  'All',
  'Electronics',
  'Footwear',
  'Clothing',
  'Home & Kitchen',
  'Sports & Fitness',
  'Accessories',
];

const Home = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = { page };
        if (keyword) params.keyword = keyword;
        if (category !== 'All') params.category = category;
        const { data } = await API.get('/products', { params });
        setProducts(data.products);
        setPages(data.pages);
        setError('');
      } catch (err) {
        setError('Could not load products. Is the backend server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, page]);

  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to ShopEZ</h1>
        <p>Effortless online shopping — great products, great prices.</p>
      </div>

      <div className="category-bar">
        {categories.map((c) => (
          <button
            key={c}
            className={c === category ? 'category-btn active' : 'category-btn'}
            onClick={() => { setCategory(c); setPage(1); }}
          >
            {c}
          </button>
        ))}
      </div>

      {keyword && <h3 className="search-heading">Results for "{keyword}"</h3>}

      {loading && <p className="loading">Loading products...</p>}
      {error && <p className="error-box">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="empty-state">No products found.</p>
      )}

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {pages > 1 && (
        <div className="pagination">
          {[...Array(pages).keys()].map((x) => (
            <button
              key={x + 1}
              className={page === x + 1 ? 'page-btn active' : 'page-btn'}
              onClick={() => setPage(x + 1)}
            >
              {x + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
