"use client";

import { useMemo, useState } from "react";

export type MenuItemView = {
  id: string;
  name: string;
  priceLabel: string;
  diet: "VEG" | "NON_VEG";
  available: boolean;
};

export type MenuCategoryView = {
  id: string;
  name: string;
  items: MenuItemView[];
};

export function MenuBrowser({
  categories,
  tableLabel,
  guestName,
  phoneDisplay,
  address,
}: {
  categories: MenuCategoryView[];
  tableLabel: string;
  guestName: string;
  phoneDisplay: string;
  address: string;
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return categories
      .filter((category) => categoryId === "all" || category.id === categoryId)
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => item.name.toLowerCase().includes(needle)),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, categoryId, query]);

  return (
    <div className="mx-auto w-full max-w-lg pb-16">
      <header className="sticky top-0 z-10 border-b border-sand/80 bg-cream/95 px-4 py-4 backdrop-blur">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brass">{tableLabel}</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h1 className="font-serif text-4xl leading-none">Menu</h1>
          <p className="text-right text-xs text-muted">Hello, {guestName}</p>
        </div>
        <label className="mt-4 block text-sm">
          <span className="sr-only">Search dishes</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the menu"
            className="w-full rounded-full border border-sand bg-paper px-4 py-3"
          />
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <Chip active={categoryId === "all"} onClick={() => setCategoryId("all")}>
            All
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category.id}
              active={categoryId === category.id}
              onClick={() => setCategoryId(category.id)}
            >
              {category.name}
            </Chip>
          ))}
        </div>
      </header>

      {visible.length === 0 ? (
        <p className="px-4 py-10 text-sm text-muted">No dishes match that search.</p>
      ) : (
        visible.map((category) => (
          <section key={category.id} className="px-4 pt-6">
            <h2 className="font-serif text-3xl">{category.name}</h2>
            <ul className="mt-3 divide-y divide-sand rounded-3xl border border-sand bg-paper">
              {category.items.map((item) => (
                <li key={item.id} className={`flex gap-3 px-4 py-4 ${item.available ? "" : "opacity-50"}`}>
                  <DietMark diet={item.diet} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base leading-6">{item.name}</h3>
                      <p className="shrink-0 text-sm font-medium">{item.priceLabel}</p>
                    </div>
                    {item.available ? null : <p className="mt-1 text-xs uppercase tracking-wide">Sold out</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <footer className="px-4 pt-8 text-sm leading-6 text-muted">
        <p>Prices include GST.</p>
        <p className="mt-2">{address}</p>
        <p>{phoneDisplay}</p>
      </footer>
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm ${active ? "bg-pine text-cream" : "border border-sand bg-paper"}`}
    >
      {children}
    </button>
  );
}

function DietMark({ diet }: { diet: "VEG" | "NON_VEG" }) {
  const veg = diet === "VEG";
  return (
    <span
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      className={`mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center border ${veg ? "border-lake" : "border-[#8a3d2f]"}`}
    >
      <span className={`h-2 w-2 rounded-full ${veg ? "bg-lake" : "bg-[#8a3d2f]"}`} />
    </span>
  );
}
