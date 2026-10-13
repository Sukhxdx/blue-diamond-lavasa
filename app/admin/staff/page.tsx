import { forbidden, redirect } from "next/navigation";
import { StaffManager } from "@/components/admin/staff-manager";
import { currentStaffUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db";

export const metadata = { title: "Staff" };

export default async function StaffPage() {
  const user = await currentStaffUser();
  if (!user) redirect("/admin/login?next=/admin/staff");
  if (user.role !== "ADMIN") forbidden();

  const staff = await prisma.user.findMany({
    where: { role: "STAFF" },
    orderBy: { name: "asc" },
  });

  return (
    <section className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-serif text-5xl">Staff</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Staff can sign in. They cannot open sales, QR codes, or this page. Disabling an account signs them out immediately.
      </p>
      <div className="mt-6">
        <StaffManager
          staff={staff.map((person) => ({
            id: person.id,
            name: person.name,
            email: person.email,
            disabled: person.disabledAt !== null,
          }))}
        />
      </div>
    </section>
  );
}
