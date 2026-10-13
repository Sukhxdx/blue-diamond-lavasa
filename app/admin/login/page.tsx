import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { currentStaffUser } from "@/lib/auth/current-user";
import { safeNextPath } from "@/lib/auth/rbac";
import { RESTAURANT_NAME } from "@/lib/restaurant/constants";

export const metadata = { title: "Sign in" };

export default function LoginPage(props: { searchParams: Promise<{ next?: string | string[] }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm text-muted">Loading sign-in…</p>}>
      <LoginGate searchParams={props.searchParams} />
    </Suspense>
  );
}

async function LoginGate({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const user = await currentStaffUser();
  const query = await searchParams;
  const next = safeNextPath(Array.isArray(query.next) ? query.next[0] : query.next);
  if (user) redirect(next);

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-brass">{RESTAURANT_NAME}</p>
      <h1 className="mt-3 font-serif text-5xl">Sign in</h1>
      <LoginForm nextPath={next} />
    </section>
  );
}
