import { type CartItem, formatPrice, getCartTotal } from "@/lib/products";

export const WHATSAPP_NUMBER = "233546522181";
export const WHATSAPP_DISPLAY = "0546522181";

export function buildOrderMessage(items: CartItem[]): string {
  if (items.length === 0) {
    return "Hello Sips & Bites! I'd like to place an order.";
  }

  const lines = items.map((item) => {
    const toppingText = item.toppings?.length
      ? ` (${item.toppings.join(", ")})`
      : "";
    const lineTotal = formatPrice(item.price * item.quantity);
    return `• ${item.quantity}× ${item.name}${toppingText} — ${lineTotal}`;
  });

  return [
    "Hello Sips & Bites! I'd like to place an order:",
    "",
    ...lines,
    "",
    `Total: ${formatPrice(getCartTotal(items))}`,
    "",
    "Thank you!",
  ].join("\n");
}

export function buildWhatsAppOrderUrl(items: CartItem[]): string {
  const message = buildOrderMessage(items);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
