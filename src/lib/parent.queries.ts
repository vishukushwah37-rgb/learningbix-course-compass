import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Parent dashboard: their children, each child's courses, quiz results and certificates. */
export const parentHomeQuery = (userId: string) =>
  queryOptions({
    queryKey: ["parent-home", userId],
    queryFn: async () => {
      const { data: parent } = await supabase.from("parents").select("id, full_name, email, phone").eq("user_id", userId).maybeSingle();
      if (!parent) return { parent, children: [], enrollments: [], attempts: [], certificates: [] };

      const { data: kids } = await supabase
        .from("students")
        .select("id, full_name, student_code, grade, age, status, created_at")
        .eq("parent_id", parent.id)
        .order("created_at");
      const children = kids ?? [];
      if (children.length === 0) return { parent, children, enrollments: [], attempts: [], certificates: [] };

      const ids = children.map((c) => c.id);
      const [enr, att, cert] = await Promise.all([
        supabase
          .from("enrollments")
          .select("id, student_id, course_id, progress, status, enrolled_at, courses(id, slug, title, image_url, level)")
          .in("student_id", ids)
          .order("enrolled_at", { ascending: false }),
        supabase
          .from("quiz_attempts")
          .select("id, student_id, quiz_id, score, total, created_at, quizzes(title)")
          .in("student_id", ids)
          .order("created_at", { ascending: false }),
        supabase
          .from("certificates")
          .select("id, student_id, certificate_code, issued_at, courses(title)")
          .in("student_id", ids)
          .order("issued_at", { ascending: false }),
      ]);

      return {
        parent,
        children,
        enrollments: enr.data ?? [],
        attempts: att.data ?? [],
        certificates: cert.data ?? [],
      };
    },
  });
