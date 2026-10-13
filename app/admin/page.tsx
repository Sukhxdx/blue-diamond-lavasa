import Link from "next/link";
import { redirect } from "next/navigation";
import { currentStaffUser } from "@/lib/auth/current-user";

export const metadata = { title: "Admin" };

export default async function AdminHomePage() {
  const user = await currentStaffUser();
  if (!user) redirect("/admin/login");

  if (user.role !== "ADMIN") {
    return (
      <section className="mx-auto max-w-xl px-4 py-12">
        <h1 className="font-serif text-5xl">Staff</h1>
        <p className="mt-4 leading-7 text-muted">
          You are signed in. Billing opens in the next step. Sales totals are not available on this account.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-5xl">Owner</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <AdminLink href="/admin/tables" title="Tables" text="QR codes for each table" />
        <AdminLink href="/admin/staff" title="Staff" text="Create or disable billing accounts" />
        <AdminLink href="/admin/security" title="Security" text="Optional authenticator codes" />
      </div>
    </section>
  );
}

function AdminLink({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="rounded-3xl border border-sand bg-paper p-5 hover:border-brass">
      <h2 className="font-serif text-3xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
    </Link>
  );
}
