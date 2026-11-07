export const ORDER_STEPS = ["placed", "confirmed", "shipped", "delivered"] as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Awaiting payment",
  placed: "Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Unpaid",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

export function statusTone(status: string): "primary" | "mint" | "sun" | "destructive" | "muted" {
  if (status === "delivered" || status === "paid") return "mint";
  if (status === "cancelled" || status === "failed") return "destructive";
  if (status === "pending") return "sun";
  if (status === "shipped" || status === "confirmed") return "primary";
  return "muted";
}

export const TONE_CLASS = {
  primary: "bg-primary/10 text-primary",
  mint: "bg-mint/15 text-mint",
  sun: "bg-sun/15 text-sun-foreground",
  destructive: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
} as const;

/** Only same-site paths are allowed as post-login destinations. */
export function safeRedirect(value: unknown): string | undefined {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : undefined;
}
