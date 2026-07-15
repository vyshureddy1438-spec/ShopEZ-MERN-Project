import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/mine');
        setOrders(data);
      } catch (err) {
        // silently fail, empty list shown
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="container"><p className="loading">Loading orders...</p></div>;

  return (
    <div className="container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="empty-state">You haven't placed any orders yet. <Link to="/">Start shopping</Link></p>
      ) : (
        <div className="orders-table">
          {orders.map((order) => (
            <div className="order-row" key={order._id}>
              <div>
                <strong>Order #{order._id.slice(-8)}</strong>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>{order.orderItems.length} item(s)</div>
              <div>₹{order.totalPrice}</div>
              <div className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</div>
              <Link to={`/order-confirmation/${order._id}`}>View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
