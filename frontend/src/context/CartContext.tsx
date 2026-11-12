import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: string, customPrice?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ponivraa_cart_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not persist cart to storage:', e);
    }
  }, [cart]);

  const getCartKey = (productId: string, variant?: string) => {
    return variant ? `${productId}__${variant}` : productId;
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedVariant?: string,
    customPrice?: number
  ) => {
    const unitPrice = customPrice !== undefined ? customPrice : product.price;

    setCart((prev) => {
      const matchIndex = prev.findIndex(
        (item) =>
          item.product._id === product._id &&
          (item.selectedVariant || '') === (selectedVariant || '')
      );

      if (matchIndex > -1) {
        const existing = prev[matchIndex];
        const newQty = existing.quantity + quantity;
        const updated = [...prev];
        updated[matchIndex] = { ...existing, quantity: newQty, unitPrice };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedVariant,
          unitPrice,
        },
      ];
    });
  };

  const removeFromCart = (cartKey: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        const itemKey = getCartKey(item.product._id, item.selectedVariant);
        return itemKey !== cartKey && item.product._id !== cartKey;
      })
    );
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartKey);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        const itemKey = getCartKey(item.product._id, item.selectedVariant);
        if (itemKey === cartKey || item.product._id === cartKey) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.unitPrice || item.product.price) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
