import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  const loadProduct = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError('Product not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProduct(); }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await API.post(`/products/${id}/reviews`, { rating, comment });
      setComment('');
      setReviewMsg('Review submitted! Thank you.');
      loadProduct();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Could not submit review.');
    }
  };

  if (loading) return <div className="container"><p className="loading">Loading...</p></div>;
  if (error) return <div className="container"><p className="error-box">{error}</p></div>;
  if (!product) return null;

  const finalPrice = product.discountedPrice ?? product.price;

  return (
    <div className="container product-detail">
      <div className="product-detail-grid">
        <img src={product.image} alt={product.name} className="product-detail-img" />

        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p className="category">{product.category}</p>
          <div className="rating">
            {'★'.repeat(Math.round(product.rating || 0))}
            {'☆'.repeat(5 - Math.round(product.rating || 0))}
            <span> ({product.numReviews} reviews)</span>
          </div>

          <div className="price-row large">
            <span className="final-price">₹{finalPrice}</span>
            {product.discountPercent > 0 && (
              <>
                <span className="original-price">₹{product.price}</span>
                <span className="discount-tag inline">-{product.discountPercent}%</span>
              </>
            )}
          </div>

          <p className="description">{product.description}</p>

          <p className={product.countInStock > 0 ? 'in-stock' : 'out-stock'}>
            {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
          </p>

          {product.countInStock > 0 && (
            <div className="qty-row">
              <label>Quantity: </label>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          )}

          <button
            className="btn-primary"
            disabled={product.countInStock === 0}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Customer Reviews</h3>
        {product.reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}
        {product.reviews.map((r) => (
          <div className="review-item" key={r._id}>
            <strong>{r.name}</strong>
            <div className="rating">
              {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
            </div>
            <p>{r.comment}</p>
          </div>
        ))}

        {user ? (
          <form className="review-form" onSubmit={submitReview}>
            <h4>Write a Review</h4>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} - {['Poor','Fair','Good','Very Good','Excellent'][r-1]}</option>
              ))}
            </select>
            <textarea
              placeholder="Share your thoughts about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit" className="btn-secondary">Submit Review</button>
            {reviewMsg && <p className="info-msg">{reviewMsg}</p>}
          </form>
        ) : (
          <p><a href="/login">Log in</a> to write a review.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
