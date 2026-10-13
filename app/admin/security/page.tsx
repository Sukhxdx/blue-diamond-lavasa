import { forbidden, redirect } from "next/navigation";
import { TotpPanel } from "@/components/admin/totp-panel";
import { currentStaffUser } from "@/lib/auth/current-user";

export const metadata = { title: "Security" };

export default async function SecurityPage() {
  const user = await currentStaffUser();
  if (!user) redirect("/admin/login?next=/admin/security");
  if (user.role !== "ADMIN") forbidden();

  return (
    <section className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-serif text-5xl">Security</h1>
      <div className="mt-6">
        <TotpPanel enabled={user.totpEnabled} />
      </div>
    </section>
  );
}
