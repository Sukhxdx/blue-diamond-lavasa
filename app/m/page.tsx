import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AccessForm } from "@/components/guest/access-form";
import { currentGuest } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db";
import { normalizeTableCode } from "@/lib/restaurant/guest";
import { RESTAURANT_NAME } from "@/lib/restaurant/constants";

export const metadata = {
  title: "Menu",
  robots: { index: false, follow: false },
};

export default function GuestPage(props: { searchParams: Promise<{ table?: string | string[] }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm text-muted">Opening the table…</p>}>
      <GuestEntry searchParams={props.searchParams} />
    </Suspense>
  );
}

async function GuestEntry({ searchParams }: { searchParams: Promise<{ table?: string | string[] }> }) {
  const query = await searchParams;
  const raw = Array.isArray(query.table) ? query.table[0] : query.table;
  const code = normalizeTableCode(raw ?? "");
  const table = code ? await prisma.diningTable.findUnique({ where: { code } }) : null;

  if (!table || !table.active) {
    return (
      <section className="mx-auto max-w-md px-4 py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-brass">{RESTAURANT_NAME}</p>
        <h1 className="mt-3 font-serif text-5xl">Scan the table card</h1>
        <p className="mt-4 leading-7 text-muted">
          This link does not match a table. Ask the staff for the QR card on your table.
        </p>
      </section>
    );
  }

  const guest = await currentGuest();
  if (guest?.tableCode === table.code) redirect(`/m/menu?table=${table.code}`);

  return (
    <>
      <p className="px-4 pt-8 text-center font-serif text-3xl">{RESTAURANT_NAME}</p>
      <AccessForm tableCode={table.code} tableLabel={table.label} />
    </>
  );
}
