"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type CartItem,
  type CartNotification,
  type ProductId,
  getCartCount,
  getCartTotal,
  getProduct,
} from "@/lib/products";

const CART_STORAGE_KEY = "sips-bites-cart";

interface CartContextValue {
  items: CartItem[];
  notifications: CartNotification[];
  itemCount: number;
  total: number;
  addToCart: (
    productId: ProductId,
    quantity?: number,
    toppings?: string[]
  ) => void;
  decreaseQuantity: (productId: ProductId) => void;
  removeFromCart: (productId: ProductId) => void;
  clearCart: () => void;
  dismissNotification: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<CartNotification[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const pushNotification = useCallback((message: string, type: CartNotification["type"] = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const addToCart = useCallback(
    (productId: ProductId, quantity = 1, toppings?: string[]) => {
      const product = getProduct(productId);
      if (!product) return;

      setItems((prev) => {
        const existing = prev.find((item) => item.productId === productId);
        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  toppings: toppings ?? item.toppings,
                }
              : item
          );
        }
        return [
          ...prev,
          {
            productId,
            name: product.name,
            quantity,
            price: product.price,
            toppings,
          },
        ];
      });

      const toppingText = toppings?.length ? ` with ${toppings.join(", ")}` : "";
      pushNotification(
        `Added ${quantity}× ${product.name}${toppingText} to your bag`
      );
    },
    [pushNotification]
  );

  const decreaseQuantity = useCallback((productId: ProductId) => {
    setItems((prev) => {
      const item = prev.find((entry) => entry.productId === productId);
      if (!item) return prev;
      if (item.quantity <= 1) {
        return prev.filter((entry) => entry.productId !== productId);
      }
      return prev.map((entry) =>
        entry.productId === productId
          ? { ...entry, quantity: entry.quantity - 1 }
          : entry
      );
    });
  }, []);

  const removeFromCart = useCallback((productId: ProductId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    pushNotification("Your bag has been cleared", "info");
  }, [pushNotification]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      items,
      notifications,
      itemCount: getCartCount(items),
      total: getCartTotal(items),
      addToCart,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      dismissNotification,
    }),
    [
      items,
      notifications,
      addToCart,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      dismissNotification,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
