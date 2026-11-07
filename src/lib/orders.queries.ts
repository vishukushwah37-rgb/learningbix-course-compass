import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getPaymentConfig } from "./orders.functions";

export const paymentConfigQuery = () => queryOptions({ queryKey: ["payment-config"], queryFn: () => getPaymentConfig(), staleTime: 300_000 });

export const myOrdersQuery = () =>
  queryOptions({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, payment_status, payment_method, total, created_at, order_items(product_name, image_url, quantity)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const orderQuery = (id: string) =>
  queryOptions({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(id, product_id, product_name, image_url, price, quantity)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
