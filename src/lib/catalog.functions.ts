import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

// Public catalogue reads (products, courses) using the publishable key; RLS allows anon SELECT on these tables.
function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const PRODUCT_FIELDS =
  "id, slug, name, short_description, price, mrp, rating, reviews_count, age_group, image_url, is_featured, created_at, product_categories(name, slug)";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("products").select(PRODUCT_FIELDS).eq("is_active", true).order("created_at");
  if (error) {
    console.error(error);
    return { products: [], categories: [] };
  }
  const { data: categories } = await publicClient().from("product_categories").select("name, slug").order("position");
  return { products: data ?? [], categories: categories ?? [] };
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const db = publicClient();
    const { data: product } = await db
      .from("products")
      .select(`${PRODUCT_FIELDS}, description, specifications, box_contents, category_id, product_images(url, position), inventory(stock)`)
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (!product) return { product: null, related: [] };
    const { data: related } = await db
      .from("products")
      .select(PRODUCT_FIELDS)
      .eq("is_active", true)
      .neq("id", product.id)
      .eq("category_id", product.category_id ?? "")
      .limit(4);
    let rel = related ?? [];
    if (rel.length < 4) {
      const { data: more } = await db.from("products").select(PRODUCT_FIELDS).eq("is_active", true).neq("id", product.id).eq("is_featured", true).limit(4);
      rel = [...rel, ...(more ?? []).filter((m) => !rel.some((r) => r.id === m.id))].slice(0, 4);
    }
    return { product, related: rel };
  });

const COURSE_FIELDS = "id, slug, title, short_description, image_url, age_group, duration, level, price, course_categories(name, slug)";

export const listCourses = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ category: z.string().max(60).optional() }).parse(d ?? {}))
  .handler(async ({ data }) => {
    let q = publicClient().from("courses").select(`${COURSE_FIELDS}, course_categories!inner(name, slug)`).eq("is_published", true).order("price");
    if (data.category) q = q.eq("course_categories.slug", data.category);
    const { data: courses, error } = await q;
    if (error) console.error(error);
    return courses ?? [];
  });

export const getCourse = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { data: course } = await publicClient()
      .from("courses")
      .select(`${COURSE_FIELDS}, description, course_modules(id, title, position, lessons(id, title, duration_minutes, position))`)
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    return course ?? null;
  });
