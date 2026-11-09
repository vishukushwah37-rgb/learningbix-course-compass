import { fetchRoles } from "./auth";
import { safeRedirect } from "./order-status";
import { homeForRoles } from "./roles";

const KEY = "lbx-post-login";

/** Remember where to go after an OAuth round-trip (same-site paths only). */
export function rememberRedirect(path: string | undefined) {
  const safe = safeRedirect(path);
  if (safe) sessionStorage.setItem(KEY, safe);
  else sessionStorage.removeItem(KEY);
}

export function takeRememberedRedirect() {
  const v = safeRedirect(sessionStorage.getItem(KEY));
  sessionStorage.removeItem(KEY);
  return v;
}

/** Where a user lands after signing in: the requested page, else their role's dashboard. */
export async function destinationAfterLogin(userId: string, requested?: string) {
  const safe = safeRedirect(requested);
  if (safe && !safe.startsWith("/login") && !safe.startsWith("/register")) return safe;
  return homeForRoles(await fetchRoles(userId));
}
