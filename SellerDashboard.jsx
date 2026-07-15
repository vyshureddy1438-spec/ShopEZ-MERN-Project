import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const emptyForm = {
  name: '', description: '', image: '', category: 'Electronics',
  price: '', discountPercent: '', countInStock: '',
};

const SellerDashboard = () => {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    const { data } = await API.get('/products/seller/mine');
    setProducts(data);
  };

  const loadOrders = async () => {
    const { data } = await API.get('/orders/seller/mine');
    setOrders(data);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadProducts(), loadOrders()]);
      setLoading(false);
    };
    init();
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0).toFixed(2);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.countInStock < 5).length;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPercent: Number(form.discountPercent) || 0,
        countInStock: Number(form.countInStock),
        image: form.image || undefined,
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
        setMessage('Product updated successfully.');
      } else {
        await API.post('/products', payload);
        setMessage('Product added successfully.');
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const editProduct = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      image: p.image,
      category: p.category,
      price: p.price,
      discountPercent: p.discountPercent,
      countInStock: p.countInStock,
    });
    setEditingId(p._id);
    setTab('add');
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await API.delete(`/products/${id}`);
    loadProducts();
  };

  const updateStatus = async (orderId, status) => {
    await API.put(`/orders/${orderId}/status`, { status });
    loadOrders();
  };

  if (loading) return <div className="container"><p className="loading">Loading dashboard...</p></div>;

  return (
    <div className="container dashboard">
      <h2>Seller Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card"><h4>Total Products</h4><p>{totalProducts}</p></div>
        <div className="stat-card"><h4>Total Orders</h4><p>{totalOrders}</p></div>
        <div className="stat-card"><h4>Revenue</h4><p>₹{totalRevenue}</p></div>
        <div className="stat-card"><h4>Low Stock Items</h4><p>{lowStock}</p></div>
      </div>

      <div className="tabs">
        <button className={tab === 'products' ? 'tab active' : 'tab'} onClick={() => setTab('products')}>My Products</button>
        <button className={tab === 'add' ? 'tab active' : 'tab'} onClick={() => { setTab('add'); resetForm(); }}>Add Product</button>
        <button className={tab === 'orders' ? 'tab active' : 'tab'} onClick={() => setTab('orders')}>Orders</button>
      </div>

      {tab === 'products' && (
        <div className="products-table">
          {products.length === 0 && <p className="empty-state">You haven't added any products yet.</p>}
          {products.map((p) => (
            <div className="product-row" key={p._id}>
              <img src={p.image} alt={p.name} />
              <div className="product-row-info">
                <strong>{p.name}</strong>
                <p>{p.category}</p>
              </div>
              <span>₹{p.price}</span>
              <span>Stock: {p.countInStock}</span>
              <div className="row-actions">
                <button onClick={() => editProduct(p)}>Edit</button>
                <button className="danger" onClick={() => deleteProduct(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'add' && (
        <form className="product-form" onSubmit={submitProduct}>
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          {message && <p className="info-msg">{message}</p>}
          <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input name="image" placeholder="Image URL (optional)" value={form.image} onChange={handleChange} />
          <select name="category" value={form.category} onChange={handleChange}>
            {['Electronics','Footwear','Clothing','Home & Kitchen','Sports & Fitness','Accessories'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="form-row">
            <input name="price" type="number" min="0" placeholder="Price (₹)" value={form.price} onChange={handleChange} required />
            <input name="discountPercent" type="number" min="0" max="90" placeholder="Discount %" value={form.discountPercent} onChange={handleChange} />
            <input name="countInStock" type="number" min="0" placeholder="Stock Qty" value={form.countInStock} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <button type="submit" className="btn-primary">{editingId ? 'Update Product' : 'Add Product'}</button>
            {editingId && <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      )}

      {tab === 'orders' && (
        <div className="orders-table">
          {orders.length === 0 && <p className="empty-state">No orders yet.</p>}
          {orders.map((order) => (
            <div className="order-row" key={order._id}>
              <div>
                <strong>Order #{order._id.slice(-8)}</strong>
                <p>{order.user?.name} ({order.user?.email})</p>
              </div>
              <div>{order.orderItems.length} item(s)</div>
              <div>₹{order.totalPrice}</div>
              <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
