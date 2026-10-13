"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} disabled={pending} className="text-sm text-cream/80">
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
