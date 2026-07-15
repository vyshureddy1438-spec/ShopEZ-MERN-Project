import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, itemsPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const proceedToCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <h2>Your Cart</h2>
        <p className="empty-state">Your cart is empty. <Link to="/">Continue shopping</Link></p>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h2>Your Cart</h2>
      <div className="cart-grid">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.product}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <Link to={`/product/${item.product}`}>{item.name}</Link>
                <p>₹{item.price} each</p>
              </div>
              <select
                value={item.qty}
                onChange={(e) => updateQty(item.product, Number(e.target.value))}
              >
                {[...Array(Math.min(item.countInStock || 10, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
              <p className="line-total">₹{(item.price * item.qty).toFixed(2)}</p>
              <button className="remove-btn" onClick={() => removeFromCart(item.product)}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({cartItems.reduce((a, i) => a + i.qty, 0)})</span>
            <span>₹{itemsPrice}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{itemsPrice > 999 ? 'Free' : '₹49'}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{(itemsPrice + (itemsPrice > 999 ? 0 : 49)).toFixed(2)}</span>
          </div>
          <button className="btn-primary full-width" onClick={proceedToCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
