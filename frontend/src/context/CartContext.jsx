import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('agri_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('agri_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const cartProduct = {
      ...product,
      product_id: product.product_id || product.id,
      quantity,
    };

    const existingIndex = cartItems.findIndex((item) => item.product_id === cartProduct.product_id);
    const isUpdate = existingIndex > -1;

    setCartItems((prevItems) => {
      if (isUpdate) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, cartProduct];
      }
    });

    if (isUpdate) {
      toast.info(`Updated ${product.title || product.name} quantity in cart!`, { autoClose: 2000 });
    } else {
      toast.success(`Added ${product.title || product.name} to your fresh cart!`, { autoClose: 2000 });
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      return prevItems.filter((item) => item.id !== productId);
    });
    toast.warn('Item removed from cart', { autoClose: 2000 });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCartItems,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
