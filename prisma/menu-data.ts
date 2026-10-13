/**
 * Printed menu transcribed from the Blue Diamond Restaurant card
 * (Green and Yellow Modern Delicious Food Menu, two landscape pages).
 * Amounts are the guest-facing rupee prices on that card. GST is included.
 * Masala Papad 50/100 is stored as 1 pc and 2 pc.
 * Jeera Rice 90/130 is stored as half and full.
 */

export type SeedItem = {
  name: string;
  rupees: number;
};

export type SeedCategory = {
  name: string;
  items: SeedItem[];
};

export const INCLUDED_GST_BPS = 500;

export const printedMenu: SeedCategory[] = [
  {
    name: "Breakfast",
    items: [
      { name: "Chole Bhature", rupees: 100 },
      { name: "Kulche Chole", rupees: 80 },
      { name: "Aloo Paratha", rupees: 100 },
      { name: "Gobi Paratha", rupees: 100 },
      { name: "Paneer Paratha", rupees: 120 },
      { name: "Kanda Bhaji", rupees: 80 },
      { name: "Batata Bhaji", rupees: 80 },
    ],
  },
  {
    name: "Soup-Voup",
    items: [
      { name: "Veg Manchow Soup", rupees: 140 },
      { name: "Veg Clear Soup", rupees: 120 },
      { name: "Hot and Sour", rupees: 120 },
      { name: "Tomato Soup", rupees: 120 },
    ],
  },
  {
    name: "Chaap-Shaap",
    items: [
      { name: "Malai Chaap", rupees: 220 },
      { name: "Banjara Chaap", rupees: 220 },
    ],
  },
  {
    name: "Starters",
    items: [
      { name: "French Fries", rupees: 100 },
      { name: "Spring Rolls", rupees: 90 },
      { name: "Cheese Roll", rupees: 100 },
      { name: "Masala Papad (1 pc)", rupees: 50 },
      { name: "Masala Papad (2 pc)", rupees: 100 },
      { name: "Paneer Pakoda", rupees: 120 },
      { name: "Honey Chilli Fries", rupees: 130 },
      { name: "Veg Crispy", rupees: 200 },
      { name: "Paneer Crispy", rupees: 250 },
      { name: "Paneer Chilly", rupees: 250 },
      { name: "Paneer 65", rupees: 250 },
      { name: "Paneer Manchurian", rupees: 230 },
      { name: "Gobi Manchurian", rupees: 180 },
      { name: "Dahi Wada", rupees: 100 },
      { name: "Chilly Potato", rupees: 130 },
    ],
  },
  {
    name: "Dal & Sabzi",
    items: [
      { name: "Dal Fry", rupees: 130 },
      { name: "Dal Tadka", rupees: 150 },
      { name: "Dal Makhani", rupees: 180 },
      { name: "Bhindi Masala", rupees: 200 },
      { name: "Kurkuri Bhindi", rupees: 180 },
      { name: "Mix Veg", rupees: 220 },
      { name: "Sev Bhaji", rupees: 180 },
    ],
  },
  {
    name: "Sabzi Specials",
    items: [
      { name: "Aloo Gobi", rupees: 180 },
      { name: "Punjabi Chole", rupees: 180 },
      { name: "Rajma", rupees: 180 },
      { name: "Veg Kofta", rupees: 220 },
      { name: "Veg Maratha", rupees: 240 },
      { name: "Baingan Bharta", rupees: 180 },
    ],
  },
  {
    name: "Chawal Shawal",
    items: [
      { name: "Steam Rice", rupees: 90 },
      { name: "Jeera Rice (Half)", rupees: 90 },
      { name: "Jeera Rice (Full)", rupees: 130 },
      { name: "Veg Dum Biryani", rupees: 220 },
      { name: "Dal Khichadi", rupees: 180 },
      { name: "Veg Fried Rice", rupees: 160 },
      { name: "Veg Manchurian Rice", rupees: 240 },
      { name: "Veg Schezwan Rice", rupees: 180 },
      { name: "Curd Rice", rupees: 180 },
    ],
  },
  {
    name: "Roti-Shoti",
    items: [
      { name: "Tandoori Roti", rupees: 25 },
      { name: "Butter Roti", rupees: 35 },
      { name: "Chapati", rupees: 15 },
      { name: "Naan", rupees: 50 },
      { name: "Butter Naan", rupees: 60 },
      { name: "Garlic Naan", rupees: 70 },
      { name: "Garlic Butter Naan", rupees: 80 },
      { name: "Lacha Paratha", rupees: 50 },
    ],
  },
  {
    name: "Paneer Specials",
    items: [
      { name: "Paneer Toofani", rupees: 259 },
      { name: "Paneer Tikka Masala", rupees: 279 },
      { name: "Paneer Angara", rupees: 279 },
      { name: "Paneer Pasanda", rupees: 349 },
      { name: "Kadhai Paneer", rupees: 239 },
      { name: "Paneer Masala", rupees: 219 },
      { name: "Paneer Malai Kofta", rupees: 279 },
      { name: "Paneer Mushroom Keema", rupees: 249 },
      { name: "Paneer Lababdar", rupees: 259 },
      { name: "Paneer Mushroom", rupees: 249 },
      { name: "Kadhai Mushroom", rupees: 239 },
      { name: "Kaju Paneer Masala", rupees: 279 },
      { name: "Palak Paneer", rupees: 239 },
      { name: "Paneer Bhurji", rupees: 249 },
      { name: "Butter Paneer", rupees: 279 },
      { name: "Paneer Kolhapuri", rupees: 259 },
      { name: "Matar Paneer", rupees: 219 },
      { name: "Paneer Patiala", rupees: 319 },
    ],
  },
  {
    name: "More Favourites",
    items: [
      { name: "Veg Kolhapuri", rupees: 219 },
      { name: "Dal Kolhapuri", rupees: 159 },
      { name: "Mushroom Masala", rupees: 219 },
      { name: "Kaju Masala", rupees: 319 },
      { name: "Kaju Curry", rupees: 299 },
      { name: "Dum Aloo", rupees: 179 },
      { name: "Kashmiri Aloo", rupees: 219 },
      { name: "Mushroom Chilly", rupees: 229 },
      { name: "Aloo Jeera", rupees: 149 },
    ],
  },
  {
    name: "Desserts",
    items: [
      { name: "Sizzling Brownie", rupees: 199 },
      { name: "Rabdi Gulab Jamun", rupees: 99 },
      { name: "Ice Cream Falooda", rupees: 119 },
      { name: "Shahi Tukda", rupees: 99 },
    ],
  },
  {
    name: "Seasonals",
    items: [
      { name: "Strawberry with Cream", rupees: 199 },
      { name: "Mango with Cream", rupees: 199 },
      { name: "Makki ki Roti Sarso ka Saag", rupees: 119 },
    ],
  },
];
