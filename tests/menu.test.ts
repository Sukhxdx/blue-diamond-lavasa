import { describe, expect, it } from "vitest";
import { printedMenu } from "../prisma/menu-data";

describe("printed menu", () => {
  it("keeps the transcribed card as 12 categories and 92 dishes", () => {
    expect(printedMenu).toHaveLength(12);
    const items = printedMenu.flatMap((category) => category.items);
    expect(items).toHaveLength(92);
    for (const category of printedMenu) {
      const names = category.items.map((item) => item.name);
      expect(new Set(names).size).toBe(names.length);
      for (const item of category.items) {
        expect(Number.isInteger(item.rupees)).toBe(true);
        expect(item.rupees).toBeGreaterThan(0);
      }
    }
    expect(items.find((item) => item.name === "Jeera Rice (Half)")?.rupees).toBe(90);
    expect(items.find((item) => item.name === "Jeera Rice (Full)")?.rupees).toBe(130);
    expect(items.find((item) => item.name === "Masala Papad (1 pc)")?.rupees).toBe(50);
    expect(items.find((item) => item.name === "Veg Schezwan Rice")?.rupees).toBe(180);
    expect(items.find((item) => item.name === "Paneer Pasanda")?.rupees).toBe(349);
  });
});
