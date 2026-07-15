import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const finalPrice = product.discountedPrice ?? product.price;
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      {product.discountPercent > 0 && (
        <span className="discount-tag">-{product.discountPercent}%</span>
      )}
      <img src={product.image} alt={product.name} />
      <div className="product-card-body">
        <h4>{product.name}</h4>
        <p className="category">{product.category}</p>
        <div className="rating">
          {'★'.repeat(Math.round(product.rating || 0))}
          {'☆'.repeat(5 - Math.round(product.rating || 0))}
          <span> ({product.numReviews || 0})</span>
        </div>
        <div className="price-row">
          <span className="final-price">₹{finalPrice}</span>
          {product.discountPercent > 0 && (
            <span className="original-price">₹{product.price}</span>
          )}
        </div>
        <p className={product.countInStock > 0 ? 'in-stock' : 'out-stock'}>
          {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
