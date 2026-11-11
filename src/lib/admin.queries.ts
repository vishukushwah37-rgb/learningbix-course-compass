import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const count = async (table: "students" | "teachers" | "schools" | "franchises" | "orders" | "enquiries" | "trial_bookings") => {
  const { count: n } = await supabase.from(table).select("*", { count: "exact", head: true });
  return n ?? 0;
};

/** Admin overview: headline numbers plus the freshest leads and orders. */
export const adminHomeQuery = () =>
  queryOptions({
    queryKey: ["admin-home"],
    queryFn: async () => {
      const [students, teachers, schools, franchises, orders, newEnquiries, newTrials, paid, enq, trials, fapps, sapps, recent] = await Promise.all([
        count("students"),
        count("teachers"),
        count("schools"),
        count("franchises"),
        count("orders"),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new").then((r) => r.count ?? 0),
        supabase.from("trial_bookings").select("id", { count: "exact", head: true }).eq("status", "new").then((r) => r.count ?? 0),
        supabase.from("payments").select("amount").eq("status", "paid"),
        supabase.from("enquiries").select("id, name, email, phone, subject, source, status, created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("trial_bookings").select("id, parent_name, child_name, child_age, preferred_program, preferred_date, preferred_time, status, created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("franchise_applications").select("id, applicant_name, city, state, investment_capacity, status, created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("school_applications").select("id, school_name, city, state, contact_person, status, created_at").order("created_at", { ascending: false }).limit(6),
        supabase
          .from("orders")
          .select("id, order_number, customer_name, status, payment_status, total, created_at")
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      return {
        students,
        teachers,
        schools,
        franchises,
        orders,
        newEnquiries,
        newTrials,
        revenue: (paid.data ?? []).reduce((n, p) => n + Number(p.amount), 0),
        enquiries: enq.data ?? [],
        trials: trials.data ?? [],
        franchiseApps: fapps.data ?? [],
        schoolApps: sapps.data ?? [],
        recentOrders: recent.data ?? [],
      };
    },
  });

export const adminTrialsQuery = () =>
  queryOptions({
    queryKey: ["admin-trials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("trial_bookings").select("*").order("status", { ascending: true }).order("preferred_date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

export const adminEnquiriesQuery = () =>
  queryOptions({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("enquiries").select("*").order("status", { ascending: true }).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const adminSchoolsQuery = () =>
  queryOptions({
    queryKey: ["admin-schools"],
    queryFn: async () => {
      const [apps, orgs] = await Promise.all([
        supabase.from("school_applications").select("*").order("status", { ascending: true }).order("created_at", { ascending: false }),
        supabase.from("schools").select("id, name, city, state, package, status, email, phone, owner_id, created_at").order("created_at", { ascending: false }),
      ]);
      return { applications: apps.data ?? [], schools: orgs.data ?? [] };
    },
  });

export const adminFranchisesQuery = () =>
  queryOptions({
    queryKey: ["admin-franchises"],
    queryFn: async () => {
      const [apps, orgs] = await Promise.all([
        supabase.from("franchise_applications").select("*").order("status", { ascending: true }).order("created_at", { ascending: false }),
        supabase.from("franchises").select("id, name, city, state, status, email, phone, owner_id, created_at").order("created_at", { ascending: false }),
      ]);
      return { applications: apps.data ?? [], franchises: orgs.data ?? [] };
    },
  });

export const adminOrdersQuery = () =>
  queryOptions({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, customer_name, customer_email, customer_phone, city, state, status, payment_status, payment_method, subtotal, shipping, total, created_at, order_items(product_name, quantity, image_url)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const adminUsersQuery = () =>
  queryOptions({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [people, roles] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, phone, city, state, is_active, created_at").order("created_at", { ascending: false }).limit(500),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      const byUser = new Map<string, string[]>();
      for (const r of roles.data ?? []) {
        const list = byUser.get(r.user_id) ?? [];
        list.push(r.role);
        byUser.set(r.user_id, list);
      }
      return {
        users: (people.data ?? []).map((p) => ({ ...p, roles: byUser.get(p.id) ?? [] })),
        rolesError: roles.error?.message ?? null,
      };
    },
  });
