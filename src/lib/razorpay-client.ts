// Browser-side Razorpay Checkout loader.
type RazorpaySuccess = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill?: { name?: string | undefined; email?: string | undefined; contact?: string | undefined };
  theme?: { color?: string };
  handler: (r: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
};
type RazorpayInstance = { open: () => void; on: (event: string, cb: () => void) => void };

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let loading: Promise<boolean> | null = null;
function loadScript(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  loading ??= new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => {
      loading = null;
      resolve(false);
    };
    document.body.appendChild(s);
  });
  return loading;
}

/** Opens Razorpay Checkout. Resolves with the payment proof, or null if the buyer closed it. */
export async function payWithRazorpay(opts: Omit<RazorpayOptions, "handler" | "modal">): Promise<RazorpaySuccess | null> {
  const ok = await loadScript();
  if (!ok || !window.Razorpay) throw new Error("Couldn't load the payment window. Check your connection and try again.");
  const Rzp = window.Razorpay;
  return new Promise((resolve) => {
    const rzp = new Rzp({ ...opts, handler: (r) => resolve(r), modal: { ondismiss: () => resolve(null) } });
    rzp.open();
  });
}
