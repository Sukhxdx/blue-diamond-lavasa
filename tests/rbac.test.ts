import { describe, expect, it } from "vitest";
import { adminRouteDecision, loginBlocked, safeNextPath } from "../lib/auth/rbac";

describe("role authorization", () => {
  it("lets only an active admin open QR, staff, and security tools", () => {
    expect(adminRouteDecision("/admin/tables", "ADMIN", false)).toBe("allow");
    expect(adminRouteDecision("/api/admin/tables/T01/qr", "ADMIN", false)).toBe("allow");
    expect(adminRouteDecision("/admin/tables", "STAFF", false)).toBe("forbid");
    expect(adminRouteDecision("/admin/staff", "STAFF", false)).toBe("forbid");
    expect(adminRouteDecision("/admin/security", "STAFF", false)).toBe("forbid");
    expect(adminRouteDecision("/api/admin/staff", null, false)).toBe("login");
    expect(adminRouteDecision("/admin/tables", "ADMIN", true)).toBe("login");
  });

  it("lets staff reach the home screen and leaves the login page public", () => {
    expect(adminRouteDecision("/admin", "STAFF", false)).toBe("allow");
    expect(adminRouteDecision("/admin/login", null, false)).toBe("public");
    expect(adminRouteDecision("/m", null, false)).toBe("public");
  });

  it("blocks repeated login failures and rejects open redirects", () => {
    expect(loginBlocked(8, 0)).toBe(true);
    expect(loginBlocked(1, 8)).toBe(true);
    expect(loginBlocked(7, 7)).toBe(false);
    expect(safeNextPath("https://evil.example")).toBe("/admin");
    expect(safeNextPath("//evil.example")).toBe("/admin");
    expect(safeNextPath("/admin/tables")).toBe("/admin/tables");
  });
});
