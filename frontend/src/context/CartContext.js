import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('shopez_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopez_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product === product._id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.discountedPrice ?? product.price,
          countInStock: product.countInStock,
          qty,
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.product === productId ? { ...item, qty } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
  };

  const clearCart = () => setCartItems([]);

  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = +cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart, itemsCount, itemsPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
