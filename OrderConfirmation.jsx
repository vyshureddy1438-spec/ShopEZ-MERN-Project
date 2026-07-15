import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError('Could not load order details.');
      }
    };
    fetchOrder();
  }, [id]);

  if (error) return <div className="container"><p className="error-box">{error}</p></div>;
  if (!order) return <div className="container"><p className="loading">Loading...</p></div>;

  return (
    <div className="container order-confirmation">
      <div className="confirmation-banner">
        <h2>✓ Order Placed Successfully!</h2>
        <p>Thank you for shopping with ShopEZ. Your order ID is <strong>{order._id}</strong></p>
      </div>

      <div className="order-details-card">
        <h3>Shipping Address</h3>
        <p>
          {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>

        <h3>Payment Method</h3>
        <p>{order.paymentMethod}</p>

        <h3>Order Items</h3>
        {order.orderItems.map((item) => (
          <div className="summary-row" key={item.product}>
            <span>{item.name} × {item.qty}</span>
            <span>₹{(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}

        <div className="summary-row">
          <span>Shipping</span>
          <span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>

        <p className="status-tag">Status: {order.status}</p>
      </div>

      <Link to="/" className="btn-primary">Continue Shopping</Link>
    </div>
  );
};

export default OrderConfirmation;
