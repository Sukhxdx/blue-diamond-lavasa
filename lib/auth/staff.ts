import { Prisma } from "@prisma/client";
import { writeAudit } from "@/lib/audit";
import { hashPassword } from "@/lib/auth/password";
import { passwordProblems } from "@/lib/auth/password-policy";
import { prisma } from "@/lib/db";
import { HttpError } from "@/lib/security/request";

export async function createStaffAccount(input: {
  name: string;
  email: string;
  password: string;
  actorId: string;
  ipHash: string | null;
}) {
  const email = input.email.toLowerCase();
  const problems = passwordProblems(input.password, email);
  if (problems.length > 0) throw new HttpError(400, problems[0]!);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email,
        passwordHash: await hashPassword(input.password),
        role: "STAFF",
      },
    });
    await writeAudit({
      actorId: input.actorId,
      action: "STAFF_CREATED",
      entityType: "User",
      entityId: user.id,
      metadata: { email },
      ipHash: input.ipHash,
    });
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new HttpError(409, "That email is already in use.");
    }
    throw error;
  }
}

export async function setStaffDisabled(input: {
  userId: string;
  disabled: boolean;
  actorId: string;
  ipHash: string | null;
}) {
  if (input.userId === input.actorId) throw new HttpError(400, "You cannot disable your own account.");
  const user = await prisma.user.findUnique({ where: { id: input.userId } });
  if (!user || user.role !== "STAFF") throw new HttpError(404, "Staff account not found.");

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { disabledAt: input.disabled ? new Date() : null },
    }),
    ...(input.disabled ? [prisma.session.deleteMany({ where: { userId: user.id } })] : []),
  ]);
  await writeAudit({
    actorId: input.actorId,
    action: input.disabled ? "STAFF_DISABLED" : "STAFF_ENABLED",
    entityType: "User",
    entityId: user.id,
    metadata: { email: user.email },
    ipHash: input.ipHash,
  });
}
