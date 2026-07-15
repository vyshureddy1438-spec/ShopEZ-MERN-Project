import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(data.role === 'seller' ? '/seller/dashboard' : redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page">
      <form className="auth-form" onSubmit={submit}>
        <h2>Login to ShopEZ</h2>
        {error && <p className="error-box">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="switch-auth">
          New to ShopEZ? <Link to="/register">Create an account</Link>
        </p>
        <p className="hint">Demo seller: seller@shopez.com / seller123 (after running the seed script)</p>
      </form>
    </div>
  );
};

export default Login;
