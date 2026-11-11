import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Teacher dashboard: the classes, batches, students, assignments and submissions this teacher owns. */
export const teacherHomeQuery = (userId: string) =>
  queryOptions({
    queryKey: ["teacher-home", userId],
    queryFn: async () => {
      const { data: teacher } = await supabase
        .from("teachers")
        .select("id, full_name, email, phone, specialization, experience_years, status, school_id, franchise_id, schools(name), franchises(name)")
        .eq("user_id", userId)
        .maybeSingle();

      if (!teacher) return { teacher, batches: [], classes: [], students: [], assignments: [], submissions: [] };

      const [b, c, st, a] = await Promise.all([
        supabase.from("batches").select("id, name, schedule, timing, capacity, status, start_date, courses(title)").eq("teacher_id", teacher.id).order("created_at", { ascending: false }),
        supabase.from("classes").select("id, name, grade, section, courses(title)").eq("teacher_id", teacher.id).order("name"),
        supabase.from("students").select("id, full_name, student_code, grade, status, class_id").order("full_name"),
        supabase
          .from("assignments")
          .select("id, title, description, due_date, max_marks, created_at, courses(title), batches(name)")
          .or(`teacher_id.eq.${teacher.id},created_by.eq.${userId}`)
          .order("created_at", { ascending: false }),
      ]);

      const assignments = a.data ?? [];
      const submissions = assignments.length
        ? (
            await supabase
              .from("submissions")
              .select("id, assignment_id, student_id, status, marks, content, feedback, submitted_at, assignments(title, max_marks), students(full_name, student_code)")
              .in("assignment_id", assignments.map((x) => x.id))
              .order("submitted_at", { ascending: false })
          ).data ?? []
        : [];

      return { teacher, batches: b.data ?? [], classes: c.data ?? [], students: st.data ?? [], assignments, submissions };
    },
  });
