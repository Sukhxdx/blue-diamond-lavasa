import Link from "next/link";
import { Suspense } from "react";
import { MenuBrowser, type MenuCategoryView } from "@/components/guest/menu-browser";
import { currentGuest } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db";
import { formatInr } from "@/lib/money";
import { normalizeTableCode } from "@/lib/restaurant/guest";
import { RESTAURANT_ADDRESS, RESTAURANT_NAME, RESTAURANT_PHONE_DISPLAY } from "@/lib/restaurant/constants";

export const metadata = {
  title: "Menu",
  robots: { index: false, follow: false },
};

export default function MenuPage(props: { searchParams: Promise<{ table?: string | string[] }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm text-muted">Loading the menu…</p>}>
      <MenuGate searchParams={props.searchParams} />
    </Suspense>
  );
}

async function MenuGate({ searchParams }: { searchParams: Promise<{ table?: string | string[] }> }) {
  const query = await searchParams;
  const raw = Array.isArray(query.table) ? query.table[0] : query.table;
  const code = normalizeTableCode(raw ?? "");
  const guest = await currentGuest();

  if (!guest || guest.tableCode !== code) {
    return (
      <section className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-5xl">Verify this table</h1>
        <p className="mt-4 leading-7 text-muted">
          The menu opens after your WhatsApp number is checked for this table.
        </p>
        <Link href={`/m?table=${encodeURIComponent(code)}`} className="mt-6 inline-flex rounded-full bg-pine px-5 py-3 text-sm text-cream">
          Continue
        </Link>
      </section>
    );
  }

  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { items: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.restaurantSettings.findUnique({ where: { id: 1 } }),
  ]);

  const view: MenuCategoryView[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    items: category.items.map((item) => ({
      id: item.id,
      name: item.name,
      priceLabel: formatInr(item.pricePaise),
      diet: item.diet,
      available: item.available,
    })),
  }));

  return (
    <>
      <p className="sr-only">{RESTAURANT_NAME}</p>
      <MenuBrowser
        categories={view}
        tableLabel={guest.tableLabel}
        guestName={guest.name}
        phoneDisplay={settings?.phone || RESTAURANT_PHONE_DISPLAY}
        address={settings?.address || RESTAURANT_ADDRESS}
      />
    </>
  );
}
