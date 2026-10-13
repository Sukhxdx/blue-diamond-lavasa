import { Suspense } from "react";
import { AdminShell } from "@/components/admin/shell";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm text-muted">Loading…</p>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
