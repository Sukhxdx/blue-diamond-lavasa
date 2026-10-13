import { PrismaClient, type Role } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";
import { passwordProblems } from "../lib/auth/password-policy";
import { rupeesToPaise } from "../lib/money";
import {
  RESTAURANT_ADDRESS,
  RESTAURANT_NAME,
  RESTAURANT_PHONE_DISPLAY,
} from "../lib/restaurant/constants";
import { INCLUDED_GST_BPS, printedMenu } from "./menu-data";

const prisma = new PrismaClient();

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required to seed the database`);
  return value;
}

async function createUserIfMissing(input: { name: string; email: string; password: string; role: Role }) {
  const email = input.email.toLowerCase();
  const problems = passwordProblems(input.password, email);
  if (problems.length > 0) throw new Error(`${email}: ${problems.join(" ")}`);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;
  await prisma.user.create({
    data: {
      name: input.name,
      email,
      passwordHash: await hashPassword(input.password),
      role: input.role,
    },
  });
}

async function main() {
  await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: RESTAURANT_NAME,
      gstin: process.env.SEED_GSTIN?.trim() || "UNCONFIGURED",
      address: RESTAURANT_ADDRESS,
      phone: RESTAURANT_PHONE_DISPLAY,
    },
  });
  await prisma.billCounter.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, lastNumber: 0 },
  });

  await createUserIfMissing({
    name: required("SEED_ADMIN_NAME"),
    email: required("SEED_ADMIN_EMAIL"),
    password: required("SEED_ADMIN_PASSWORD"),
    role: "ADMIN",
  });
  const staffPassword = required("SEED_STAFF_PASSWORD");
  await createUserIfMissing({
    name: required("SEED_STAFF_ONE_NAME"),
    email: required("SEED_STAFF_ONE_EMAIL"),
    password: staffPassword,
    role: "STAFF",
  });
  await createUserIfMissing({
    name: required("SEED_STAFF_TWO_NAME"),
    email: required("SEED_STAFF_TWO_EMAIL"),
    password: staffPassword,
    role: "STAFF",
  });

  for (let index = 1; index <= 10; index += 1) {
    const code = `T${index.toString().padStart(2, "0")}`;
    await prisma.diningTable.upsert({
      where: { code },
      update: {},
      create: { code, label: `Table ${index}` },
    });
  }

  for (const [categoryIndex, category] of printedMenu.entries()) {
    const saved = await prisma.category.upsert({
      where: { name: category.name },
      update: { sortOrder: categoryIndex },
      create: { name: category.name, sortOrder: categoryIndex },
    });
    for (const [itemIndex, item] of category.items.entries()) {
      const existing = await prisma.menuItem.findUnique({
        where: { categoryId_name: { categoryId: saved.id, name: item.name } },
      });
      if (existing) continue;
      await prisma.menuItem.create({
        data: {
          categoryId: saved.id,
          name: item.name,
          pricePaise: rupeesToPaise(item.rupees),
          gstBps: INCLUDED_GST_BPS,
          diet: "VEG",
          available: true,
          sortOrder: itemIndex,
        },
      });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error instanceof Error ? error.message : "Seed failed");
    await prisma.$disconnect();
    process.exit(1);
  });
