export type AppRole = "ADMIN" | "STAFF";

export type AccessDecision = "public" | "allow" | "login" | "forbid";

const ADMIN_ONLY = ["/admin/tables", "/admin/staff", "/admin/security", "/api/admin"];

export function adminRouteDecision(
  pathname: string,
  role: AppRole | null,
  disabled: boolean,
): AccessDecision {
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) return "public";

  const needsSession =
    pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin");
  if (!needsSession) return "public";
  if (!role || disabled) return "login";

  const adminOnly = ADMIN_ONLY.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (adminOnly && role !== "ADMIN") return "forbid";
  return "allow";
}

export function loginBlocked(emailFails: number, ipFails: number): boolean {
  return emailFails >= 8 || ipFails >= 8;
}

export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/admin") || value.startsWith("//") || value.includes("\\")) {
    return "/admin";
  }
  if (value.startsWith("/admin/login")) return "/admin";
  return value;
}
