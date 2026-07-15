import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const shippingPrice = itemsPrice > 999 ? 0 : 49;
  const total = (itemsPrice + shippingPrice).toFixed(2);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const orderItems = cartItems.map((i) => ({ product: i.product, qty: i.qty }));
      const { data } = await API.post('/orders', {
        orderItems,
        shippingAddress: form,
        paymentMethod,
      });
      clearCart();
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order.');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="container"><p className="empty-state">Your cart is empty.</p></div>;
  }

  return (
    <div className="container checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={placeOrder}>
          <h3>Shipping Address</h3>
          <input name="address" placeholder="Street Address" value={form.address} onChange={handleChange} required />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
          <input name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} required />
          <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />

          <h3>Payment Method</h3>
          <div className="payment-options">
            {['Cash on Delivery', 'Credit / Debit Card', 'UPI'].map((m) => (
              <label key={m} className="radio-option">
                <input
                  type="radio"
                  name="payment"
                  value={m}
                  checked={paymentMethod === m}
                  onChange={() => setPaymentMethod(m)}
                />
                {m}
              </label>
            ))}
          </div>
          <p className="hint">This is a demo checkout — no real payment will be processed.</p>

          {error && <p className="error-box">{error}</p>}
          <button type="submit" className="btn-primary full-width" disabled={placing}>
            {placing ? 'Placing Order...' : `Place Order — ₹${total}`}
          </button>
        </form>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div className="summary-row" key={item.product}>
              <span>{item.name} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
