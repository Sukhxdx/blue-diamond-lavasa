export type PhotoCategory = "villa" | "rooms" | "restaurant" | "views" | "hotel";

export type SitePhoto = {
  src: string;
  alt: string;
  category: PhotoCategory;
  width: number;
  height: number;
};

export const photos: SitePhoto[] = [
  {
    src: "/photos/villa/on-air-lake.jpg",
    alt: "Gold On Air letters on the villa lawn, with the lake and hills of Lavasa behind them",
    category: "villa",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/villa/house-front.jpg",
    alt: "Front of the On Air villa, a two-storey house with a red roof trim and a green lawn",
    category: "villa",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/villa/house-dusk.jpg",
    alt: "The On Air villa at dusk, with warm light in the windows",
    category: "villa",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/villa/on-air-night.jpg",
    alt: "The On Air name lit on the lawn at night, with the villa glowing behind it",
    category: "villa",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/villa/lawn-dining.jpg",
    alt: "Outdoor dining table on the On Air lawn, facing the lake",
    category: "villa",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/villa/living-room.jpg",
    alt: "On Air living room with sofas, opening onto the lawn",
    category: "villa",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/villa/bedroom.jpg",
    alt: "On Air bedroom with a wooden bed, white linen, and windows toward the hills",
    category: "villa",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/villa/bedroom-sunlight.jpg",
    alt: "Sunlit On Air bedroom with a red bed runner and a wooden wardrobe",
    category: "villa",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/villa/bedroom-corner.jpg",
    alt: "On Air bedroom corner with a wooden bed, desk, and a view through the window",
    category: "villa",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/villa/terrace.jpg",
    alt: "Covered terrace at On Air looking across the lawn to the hills",
    category: "villa",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/villa/terrace-day.jpg",
    alt: "Open terrace at On Air with chairs and a view of the hills",
    category: "views",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/villa/terrace-dusk.jpg",
    alt: "On Air terrace at dusk, with floor cushions and lamps",
    category: "villa",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/views/lavasa-lake.jpg",
    alt: "Lake and hillside town seen from On Air in Lavasa",
    category: "views",
    width: 1800,
    height: 1200,
  },
  {
    src: "/photos/rooms/deluxe-lake-door.jpg",
    alt: "Deluxe four-sharing room at Blue Diamond Hotel, with a bed and a door opening to the lake",
    category: "rooms",
    width: 1800,
    height: 1350,
  },
  {
    src: "/photos/rooms/deluxe-two-beds.jpg",
    alt: "Two beds in the deluxe four-sharing room, divided by a carved wooden screen",
    category: "rooms",
    width: 1350,
    height: 1800,
  },
  {
    src: "/photos/rooms/deluxe-both-beds.jpg",
    alt: "Both beds in the deluxe four-sharing room at Blue Diamond Hotel",
    category: "rooms",
    width: 1350,
    height: 1800,
  },
  {
    src: "/photos/views/deluxe-balcony.jpg",
    alt: "Lake and hills from the balcony of a Blue Diamond Hotel room",
    category: "views",
    width: 1800,
    height: 1350,
  },
  {
    src: "/photos/rooms/double-bed.jpg",
    alt: "Double room at Blue Diamond Hotel, with one bed and a sofa",
    category: "rooms",
    width: 1350,
    height: 1800,
  },
  {
    src: "/photos/rooms/double-balcony.jpg",
    alt: "Double room looking out through glass doors to a balcony and trees",
    category: "rooms",
    width: 1800,
    height: 1350,
  },
  {
    src: "/photos/hotel/building.jpg",
    alt: "Blue Diamond Hotel building in Lavasa, with balconies and the resort sign",
    category: "hotel",
    width: 1800,
    height: 1350,
  },
  {
    src: "/photos/restaurant/dining-terrace.jpg",
    alt: "Open-air restaurant terrace at Blue Diamond Hotel, set above the garden",
    category: "restaurant",
    width: 1800,
    height: 1350,
  },
];

export function photosByCategory(category: PhotoCategory) {
  return photos.filter((photo) => photo.category === category);
}
