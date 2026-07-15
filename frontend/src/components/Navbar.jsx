import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/?keyword=${encodeURIComponent(keyword.trim())}` : '/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">Shop<span>EZ</span></Link>

        <form className="search-form" onSubmit={submitSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <nav className="nav-links">
          <Link to="/cart" className="cart-link">
            Cart {itemsCount > 0 && <span className="badge">{itemsCount}</span>}
          </Link>

          {user ? (
            <>
              {user.role === 'seller' ? (
                <Link to="/seller/dashboard">Dashboard</Link>
              ) : (
                <Link to="/my-orders">My Orders</Link>
              )}
              <span className="hello">Hi, {user.name.split(' ')[0]}</span>
              <button className="link-btn" onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="cta">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
