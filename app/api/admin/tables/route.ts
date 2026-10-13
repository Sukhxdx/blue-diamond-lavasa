import { Prisma } from "@prisma/client";
import { writeAudit } from "@/lib/audit";
import { currentStaffUser } from "@/lib/auth/current-user";
import { clientIp, hashIp } from "@/lib/auth/secrets";
import { prisma } from "@/lib/db";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { normalizeTableCode } from "@/lib/restaurant/guest";
import { HttpError, assertSameOrigin } from "@/lib/security/request";
import { tableSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await currentStaffUser();
    if (!user) throw new HttpError(401, "Sign in again.");
    if (user.role !== "ADMIN") throw new HttpError(403, "Forbidden");
    const body = await readJson(request, tableSchema);
    const code = normalizeTableCode(body.code);
    try {
      const table = await prisma.diningTable.create({
        data: { code, label: body.label.trim() },
      });
      await writeAudit({
        actorId: user.id,
        action: "TABLE_CREATED",
        entityType: "DiningTable",
        entityId: table.id,
        metadata: { code },
        ipHash: hashIp(clientIp(request)),
      });
      return jsonOk({ ok: true, code: table.code }, 201);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new HttpError(409, "That table code already exists.");
      }
      throw error;
    }
  } catch (error) {
    return jsonError(error);
  }
}
