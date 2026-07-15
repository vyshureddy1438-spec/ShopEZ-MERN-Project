import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(form);
      navigate(data.role === 'seller' ? '/seller/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page">
      <form className="auth-form" onSubmit={submit}>
        <h2>Create your ShopEZ account</h2>
        {error && <p className="error-box">{error}</p>}
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} minLength={6} required />

        <div className="role-select">
          <label className="radio-option">
            <input type="radio" name="role" value="buyer" checked={form.role === 'buyer'} onChange={handleChange} />
            I want to shop (Buyer)
          </label>
          <label className="radio-option">
            <input type="radio" name="role" value="seller" checked={form.role === 'seller'} onChange={handleChange} />
            I want to sell (Seller)
          </label>
        </div>

        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
        <p className="switch-auth">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
