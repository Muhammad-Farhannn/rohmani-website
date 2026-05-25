import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('rohmani_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('rohmani_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const qty = Number(quantity);
    setCartItems(prev => {
      const existing = prev.find(item => item.id == product.id);
      if (existing) {
        return prev.map(item => 
          item.id == product.id 
            ? { ...item, quantity: Number(item.quantity) + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id != productId));
  };

  const updateQuantity = (productId, quantity) => {
    const qty = Number(quantity);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id == productId ? { ...item, quantity: qty } : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => total + (Number(item.price || 0) * Number(item.quantity || 1)), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount: cartItems.reduce((count, item) => count + Number(item.quantity || 1), 0)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
