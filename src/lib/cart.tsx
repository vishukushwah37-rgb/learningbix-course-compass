import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { computeTotals } from "./pricing";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  image: string | null;
  quantity: number;
};

type CartState = {
  /** False until the saved cart has been read from this browser. */
  hydrated: boolean;
  items: CartItem[];
  count: number;
  totals: ReturnType<typeof computeTotals>;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQuantity: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string, name?: string) => void;
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "lbx-cart-v1";
const WISHLIST_KEY = "lbx-wishlist-v1";

export function mergeCartItems(a: CartItem[], b: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of [...a, ...b]) {
    const existing = map.get(item.productId);
    map.set(item.productId, existing ? { ...item, quantity: Math.min(99, Math.max(existing.quantity, item.quantity)) } : item);
  }
  return [...map.values()];
}

async function loadServerCart(userId: string): Promise<{ cartId: string; items: CartItem[] }> {
  let { data: cart } = await supabase.from("carts").select("id").eq("user_id", userId).maybeSingle();
  if (!cart) {
    const ins = await supabase.from("carts").insert({ user_id: userId }).select("id").single();
    cart = ins.data;
  }
  if (!cart) throw new Error("Could not load cart");
  const { data } = await supabase
    .from("cart_items")
    .select("quantity, products(id, slug, name, price, mrp, image_url)")
    .eq("cart_id", cart.id);
  const items: CartItem[] = (data ?? [])
    .filter((r) => r.products)
    .map((r) => ({
      productId: r.products!.id,
      slug: r.products!.slug,
      name: r.products!.name,
      price: Number(r.products!.price),
      mrp: Number(r.products!.mrp),
      image: r.products!.image_url,
      quantity: r.quantity,
    }));
  return { cartId: cart.id, items };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const cartIdRef = useRef<string | null>(null);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore from this browser
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
      const w = localStorage.getItem(WISHLIST_KEY);
      if (w) setWishlist(JSON.parse(w) as string[]);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Merge with the signed-in account's saved cart
  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      cartIdRef.current = null;
      return;
    }
    let cancelled = false;
    loadServerCart(user.id)
      .then(({ cartId, items: serverItems }) => {
        if (cancelled) return;
        cartIdRef.current = cartId;
        setItems((local) => mergeCartItems(serverItems, local));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [user, hydrated]);

  // Persist locally and to the account
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    const cartId = cartIdRef.current;
    if (!user || !cartId) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      await supabase.from("cart_items").delete().eq("cart_id", cartId);
      if (items.length) {
        await supabase.from("cart_items").insert(items.map((i) => ({ cart_id: cartId, product_id: i.productId, quantity: i.quantity })));
      }
    }, 500);
  }, [items, user, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const add = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.productId === item.productId);
      if (found) return prev.map((p) => (p.productId === item.productId ? { ...p, quantity: Math.min(99, p.quantity + qty) } : p));
      return [...prev, { ...item, quantity: qty }];
    });
    toast.success(`${item.name} added to cart`);
  }, []);

  const setQuantity = useCallback((productId: string, qty: number) => {
    setItems((prev) => prev.map((p) => (p.productId === productId ? { ...p, quantity: Math.max(1, Math.min(99, qty)) } : p)));
  }, []);

  const remove = useCallback((productId: string) => setItems((prev) => prev.filter((p) => p.productId !== productId)), []);
  const clear = useCallback(() => setItems([]), []);
  const toggleWishlist = useCallback((productId: string, name?: string) => {
    setWishlist((prev) => {
      const has = prev.includes(productId);
      toast(has ? `Removed${name ? ` ${name}` : ""} from wishlist` : `Saved${name ? ` ${name}` : ""} to wishlist`);
      return has ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  }, []);

  const value = useMemo<CartState>(
    () => ({
      hydrated,
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      totals: computeTotals(items),
      add,
      setQuantity,
      remove,
      clear,
      wishlist,
      toggleWishlist,
    }),
    [hydrated, items, add, setQuantity, remove, clear, wishlist, toggleWishlist],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
