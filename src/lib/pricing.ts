// Store pricing rules shared by the cart (browser) and order creation (server).
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 79;

export type PricedLine = { price: number; quantity: number };

export function computeTotals(lines: PricedLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + Number(l.price) * l.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
}

export function discountPercent(price: number, mrp: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export function formatINR(value: number | string | null | undefined) {
  return inr.format(Number(value ?? 0));
}
