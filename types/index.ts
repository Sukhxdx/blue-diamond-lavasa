/** Domain shapes. The SQL migration is the source of truth once it is added. */

export type PropertyKind = "villa" | "hotel_room";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "expired";

export type RateKind = "weekday" | "weekend" | "seasonal";

export type MenuDiet = "veg" | "non_veg";

export type GalleryCategory = "villa" | "rooms" | "restaurant" | "views";

export type Property = {
  id: string;
  kind: PropertyKind;
  name: string;
  slug: string;
  description: string;
  capacity: number;
  amenities: string[];
  published: boolean;
};
