import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container not-found">
    <h1>404</h1>
    <p>The page you are looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">Go Home</Link>
  </div>
);

export default NotFound;
