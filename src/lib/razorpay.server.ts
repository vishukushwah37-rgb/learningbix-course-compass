import { createHmac, timingSafeEqual } from "node:crypto";

// Razorpay REST helpers. Keys are read per request (never at module scope).
export function razorpayKeys() {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  return keyId && keySecret ? { keyId, keySecret } : null;
}

export async function createRazorpayOrder(amountRupees: number, receipt: string) {
  const keys = razorpayKeys();
  if (!keys) throw new Error("Online payments are not set up yet.");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${keys.keyId}:${keys.keySecret}`)}`,
    },
    body: JSON.stringify({ amount: Math.round(amountRupees * 100), currency: "INR", receipt }),
  });
  if (!res.ok) {
    console.error("Razorpay order failed", res.status, await res.text());
    throw new Error("Could not start the payment. Please try again.");
  }
  const body = (await res.json()) as { id: string; amount: number; currency: string };
  return { id: body.id, amount: body.amount, currency: body.currency, keyId: keys.keyId };
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const keys = razorpayKeys();
  if (!keys) return false;
  const expected = createHmac("sha256", keys.keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
