import React, { createContext, useContext, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('shopez_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('shopez_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await API.post('/auth/register', payload);
    localStorage.setItem('shopez_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('shopez_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
