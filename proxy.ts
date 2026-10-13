import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminRouteDecision, safeNextPath } from "@/lib/auth/rbac";
import { STAFF_COOKIE, staffUserForToken } from "@/lib/auth/session-store";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let role: "ADMIN" | "STAFF" | null = null;
  let disabled = false;
  try {
    const user = await staffUserForToken(request.cookies.get(STAFF_COOKIE)?.value);
    role = user?.role ?? null;
    disabled = Boolean(user?.disabledAt);
  } catch {
    role = null;
  }

  const decision = adminRouteDecision(pathname, role, disabled);
  if (decision === "public" || decision === "allow") return NextResponse.next();

  if (decision === "forbid") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: { "Cache-Control": "no-store" } });
    }
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Sign in again." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  url.searchParams.set("next", safeNextPath(pathname));
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
