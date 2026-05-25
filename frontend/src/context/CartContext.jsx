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
    const cartId = `${product.id}-${product.size || 'M'}`;
    setCartItems(prev => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => 
          item.cartId === cartId 
            ? { ...item, quantity: Number(item.quantity) + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty, cartId }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, quantity) => {
    const qty = Number(quantity);
    if (qty <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.cartId === cartId ? { ...item, quantity: qty } : item
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
