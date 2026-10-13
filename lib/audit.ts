import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function writeAudit(entry: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonObject;
  ipHash?: string | null;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: entry.actorId ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        metadata: entry.metadata,
        ipHash: entry.ipHash ?? null,
      },
    });
  } catch (error) {
    console.error(`audit write failed for ${entry.action}`, error instanceof Error ? error.name : "error");
  }
}
