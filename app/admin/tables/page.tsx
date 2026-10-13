import { forbidden, redirect } from "next/navigation";
import { TableCreateForm } from "@/components/admin/table-create-form";
import { currentStaffUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db";
import { publicEnv } from "@/lib/public-env";

export const metadata = { title: "Tables" };

export default async function TablesPage() {
  const user = await currentStaffUser();
  if (!user) redirect("/admin/login?next=/admin/tables");
  if (user.role !== "ADMIN") forbidden();

  const tables = await prisma.diningTable.findMany({ orderBy: { code: "asc" } });

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-5xl">Table QR codes</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Each card opens {publicEnv.siteUrl}/m?table=CODE. Print or download one card per table.
      </p>
      <div className="mt-6">
        <TableCreateForm />
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => (
          <li key={table.id} className="rounded-3xl border border-sand bg-paper p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-3xl">{table.label}</h2>
                <p className="text-sm text-muted">{table.code}</p>
                {table.active ? null : <p className="text-xs uppercase">Inactive</p>}
              </div>
              {table.active ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/admin/tables/${table.code}/qr`}
                  alt={`QR code for ${table.label}`}
                  width={112}
                  height={112}
                  className="h-28 w-28"
                />
              ) : null}
            </div>
            {table.active ? (
              <a
                href={`/api/admin/tables/${table.code}/qr?download=1`}
                className="mt-4 inline-flex rounded-full bg-pine px-4 py-2 text-sm text-cream"
              >
                Download PNG
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
