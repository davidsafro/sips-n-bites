export type ProductId = "ice-kenkey" | "banana-bread" | "coco-bread";

export interface Product {
  id: ProductId;
  name: string;
  tagline: string;
  description: string;
  price: number;
  emoji: string;
  accent: string;
}

export interface CartItem {
  productId: ProductId;
  name: string;
  quantity: number;
  price: number;
  toppings?: string[];
}

export interface CartNotification {
  id: string;
  message: string;
  type: "success" | "info";
}

export const PRODUCTS: Product[] = [
  {
    id: "ice-kenkey",
    name: "Creamy Ken",
    tagline: "Signature Chill",
    description: "Creamy, rich, perfectly chilled.",
    price: 18,
    emoji: "🍨",
    accent: "from-amber-100 to-orange-50",
  },
  {
    id: "banana-bread",
    name: "BanBite",
    tagline: "House Signature",
    description: "Freshly baked, moist, infused with natural sweetness.",
    price: 22,
    emoji: "🍌",
    accent: "from-yellow-100 to-amber-50",
  },
  {
    id: "coco-bread",
    name: "ChocoBite",
    tagline: "Caribbean Classic",
    description: "Soft, pillowy, buttery, baked to perfection.",
    price: 16,
    emoji: "🥖",
    accent: "from-orange-100 to-red-50",
  },
];

export const TOPPINGS: Record<ProductId, string[]> = {
  "ice-kenkey": ["Extra chilled", "Honey drizzle", "Groundnut sprinkle", "Fresh mango"],
  "banana-bread": ["Walnuts", "Chocolate chips", "Cream cheese glaze", "Cinnamon dust"],
  "coco-bread": ["Butter spread", "Cheese filling", "Spiced beef", "Sweet coconut"],
};

export function getProduct(id: ProductId): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(amount: number): string {
  return `GH₵ ${amount.toFixed(0)}`;
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
