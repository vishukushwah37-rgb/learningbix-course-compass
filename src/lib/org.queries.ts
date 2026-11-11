import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** School-admin dashboard: everything inside the school this account owns. */
export const schoolHomeQuery = (userId: string) =>
  queryOptions({
    queryKey: ["school-home", userId],
    queryFn: async () => {
      const { data: school } = await supabase
        .from("schools")
        .select("id, name, email, phone, city, state, package, status, address, created_at")
        .eq("owner_id", userId)
        .maybeSingle();

      if (!school) return { school, classes: [], batches: [], students: [], teachers: [], payments: [] };

      const [cl, ba, st, te, pa] = await Promise.all([
        supabase.from("classes").select("id, name, grade, section, courses(title), teachers(full_name)").eq("school_id", school.id).order("name"),
        supabase.from("batches").select("id, name, schedule, timing, capacity, status, courses(title), teachers(full_name)").eq("school_id", school.id).order("created_at", { ascending: false }),
        supabase.from("students").select("id, full_name, student_code, grade, age, status, created_at").eq("school_id", school.id).order("created_at", { ascending: false }),
        supabase.from("teachers").select("id, full_name, email, phone, specialization, experience_years, status").eq("school_id", school.id).order("full_name"),
        supabase
          .from("payments")
          .select("id, receipt_number, purpose, description, amount, status, method, paid_at, created_at")
          .eq("school_id", school.id)
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      return {
        school,
        classes: cl.data ?? [],
        batches: ba.data ?? [],
        students: st.data ?? [],
        teachers: te.data ?? [],
        payments: pa.data ?? [],
      };
    },
  });

/** Franchise dashboard: the centre this account owns, its learners, staff and money. */
export const franchiseHomeQuery = (userId: string) =>
  queryOptions({
    queryKey: ["franchise-home", userId],
    queryFn: async () => {
      const { data: franchise } = await supabase
        .from("franchises")
        .select("id, name, email, phone, city, state, status, address, created_at")
        .eq("owner_id", userId)
        .maybeSingle();

      if (!franchise) return { franchise, classes: [], batches: [], students: [], teachers: [], enquiries: [], payments: [] };

      const [cl, ba, st, te, en, pa] = await Promise.all([
        supabase.from("classes").select("id, name, grade, section, courses(title), teachers(full_name)").eq("franchise_id", franchise.id).order("name"),
        supabase.from("batches").select("id, name, schedule, timing, capacity, status, courses(title), teachers(full_name)").eq("franchise_id", franchise.id).order("created_at", { ascending: false }),
        supabase.from("students").select("id, full_name, student_code, grade, age, status, created_at").eq("franchise_id", franchise.id).order("created_at", { ascending: false }),
        supabase.from("teachers").select("id, full_name, email, phone, specialization, experience_years, status").eq("franchise_id", franchise.id).order("full_name"),
        supabase
          .from("enquiries")
          .select("id, name, email, phone, subject, message, program, status, created_at")
          .eq("franchise_id", franchise.id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("payments")
          .select("id, receipt_number, purpose, description, amount, status, method, paid_at, created_at")
          .eq("franchise_id", franchise.id)
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      return {
        franchise,
        classes: cl.data ?? [],
        batches: ba.data ?? [],
        students: st.data ?? [],
        teachers: te.data ?? [],
        enquiries: en.data ?? [],
        payments: pa.data ?? [],
      };
    },
  });

/** Enquiries routed to the franchise this account owns. */
export const franchiseEnquiriesQuery = (franchiseId: string) =>
  queryOptions({
    queryKey: ["franchise-enquiries", franchiseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("id, name, email, phone, subject, message, source, program, child_name, child_age, status, follow_up_date, created_at")
        .eq("franchise_id", franchiseId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
