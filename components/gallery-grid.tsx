"use client";

import Image from "next/image";
import { useState } from "react";
import { photos } from "@/lib/photos";

const filters = [
  { id: "all", label: "All" },
  { id: "villa", label: "Villa" },
  { id: "rooms", label: "Rooms" },
  { id: "restaurant", label: "Restaurant" },
  { id: "views", label: "Views" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export function GalleryGrid() {
  const [filter, setFilter] = useState<FilterId>("all");
  const visible = photos.filter((photo) => filter === "all" || photo.category === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Gallery categories">
        {filters.map((item) => {
          const selected = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(item.id)}
              className={`rounded-full border px-4 py-2 text-sm ${
                selected ? "border-pine bg-pine text-cream" : "border-sand bg-paper text-ink"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {visible.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-sand bg-paper px-6 py-16 text-center text-muted">
          No photographs in this category yet.
        </p>
      ) : (
        <ul className="mt-8 columns-2 gap-3 md:columns-3">
          {visible.map((photo) => (
            <li key={photo.src} className="mb-3 break-inside-avoid">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="h-auto w-full rounded-2xl"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
