import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Everything the signed-in student's dashboard needs, read through RLS. */
export const studentHomeQuery = (userId: string) =>
  queryOptions({
    queryKey: ["student-home", userId],
    queryFn: async () => {
      const { data: student } = await supabase.from("students").select("id, full_name, student_code, age, grade").eq("user_id", userId).maybeSingle();
      if (!student) return { student: null, enrollments: [], doneLessonIds: [] as string[], attempts: [], certificates: [], quizzes: [] };
      const [enr, prog, att, cert, quiz] = await Promise.all([
        supabase.from("enrollments").select("id, course_id, progress, status, enrolled_at, courses(id, slug, title, image_url, level, duration, course_categories(name))").eq("student_id", student.id).order("enrolled_at", { ascending: false }),
        supabase.from("learning_progress").select("lesson_id").eq("student_id", student.id),
        supabase.from("quiz_attempts").select("id, quiz_id, score, total, created_at, quizzes(title)").eq("student_id", student.id).order("created_at", { ascending: false }),
        supabase.from("certificates").select("id, certificate_code, issued_at, courses(title)").eq("student_id", student.id).order("issued_at", { ascending: false }),
        supabase.from("quizzes").select("id, title, description, pass_mark, course_id, courses(title)"),
      ]);
      return {
        student,
        enrollments: enr.data ?? [],
        doneLessonIds: (prog.data ?? []).map((p) => p.lesson_id),
        attempts: att.data ?? [],
        certificates: cert.data ?? [],
        quizzes: quiz.data ?? [],
      };
    },
  });

export const coursePlayerQuery = (courseId: string) =>
  queryOptions({
    queryKey: ["course-player", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, slug, title, short_description, image_url, course_modules(id, title, position, lessons(id, title, content, video_url, pdf_url, duration_minutes, position))")
        .eq("id", courseId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

/** Course player data for one signed-in student: curriculum, their enrollment and completed lessons. */
export const learnQuery = (slug: string, userId: string) =>
  queryOptions({
    queryKey: ["learn", slug, userId],
    queryFn: async () => {
      const { data: course } = await supabase
        .from("courses")
        .select("id, slug, title, short_description, image_url, course_modules(id, title, position, lessons(id, title, content, video_url, pdf_url, duration_minutes, position))")
        .eq("slug", slug)
        .maybeSingle();
      if (!course) return { course: null, enrollment: null, done: [] as string[] };

      const { data: student } = await supabase.from("students").select("id").eq("user_id", userId).maybeSingle();
      if (!student) return { course, enrollment: null, done: [] as string[] };

      const [enr, prog] = await Promise.all([
        supabase.from("enrollments").select("id, progress, status, enrolled_at").eq("student_id", student.id).eq("course_id", course.id).maybeSingle(),
        supabase.from("learning_progress").select("lesson_id").eq("student_id", student.id),
      ]);
      return { course, enrollment: enr.data ?? null, done: (prog.data ?? []).map((p) => p.lesson_id) };
    },
  });

export const quizQuestionsQuery = (quizId: string) =>
  queryOptions({
    queryKey: ["quiz-questions", quizId],
    queryFn: async () => {
      const [{ data: quiz }, { data: questions, error }] = await Promise.all([
        supabase.from("quizzes").select("id, title, description, pass_mark, courses(title)").eq("id", quizId).maybeSingle(),
        supabase.rpc("get_quiz_questions", { _quiz_id: quizId }),
      ]);
      if (error) throw error;
      return { quiz, questions: (questions ?? []).map((q) => ({ ...q, options: (Array.isArray(q.options) ? q.options : []) as string[] })) };
    },
  });
