import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

/** Public certificate lookup by code. Only returns name, course and date. */
export const verifyCertificate = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ code: z.string().trim().min(4).max(40) }).parse(d))
  .handler(async ({ data }) => {
    const url = process.env["SUPABASE_URL"]!;
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const db = createClient<Database>(url, key, {
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
    const { data: rows, error } = await db.rpc("verify_certificate", { _code: data.code.toUpperCase() });
    if (error) {
      console.error(error);
      throw new Error("Couldn't check that code right now. Please try again.");
    }
    return rows?.[0] ?? null;
  });
