import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export const ROLE_PRIORITY: AppRole[] = ["admin", "school_admin", "franchise", "teacher", "parent", "student"];

export const ROLE_HOME: Record<AppRole, string> = {
  admin: "/admin/dashboard",
  school_admin: "/school/dashboard",
  franchise: "/franchise/dashboard",
  teacher: "/teacher/dashboard",
  parent: "/parent/dashboard",
  student: "/student/dashboard",
};

export const ROLE_LABEL: Record<AppRole, string> = {
  admin: "Admin",
  school_admin: "School Admin",
  franchise: "Franchise",
  teacher: "Teacher",
  parent: "Parent",
  student: "Student",
};

/** Roles anyone can pick on the public sign-up form. Everything else is assigned by an admin. */
export const SIGNUP_ROLES = ["student", "parent"] as const satisfies readonly AppRole[];
export type SignupRole = (typeof SIGNUP_ROLES)[number];

export function sanitizeSignupRole(value: unknown): SignupRole {
  return value === "parent" ? "parent" : "student";
}

export function primaryRole(roles: readonly AppRole[]): AppRole | null {
  return ROLE_PRIORITY.find((r) => roles.includes(r)) ?? null;
}

export function homeForRoles(roles: readonly AppRole[]): string {
  const role = primaryRole(roles);
  return role ? ROLE_HOME[role] : "/";
}
