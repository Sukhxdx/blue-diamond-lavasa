import QRCode from "qrcode";
import { currentStaffUser } from "@/lib/auth/current-user";
import { jsonError } from "@/lib/http";
import { publicEnv } from "@/lib/public-env";
import { requireActiveTable } from "@/lib/restaurant/guest";
import { HttpError } from "@/lib/security/request";

export async function GET(request: Request, context: { params: Promise<{ code: string }> }) {
  try {
    const user = await currentStaffUser();
    if (!user) throw new HttpError(401, "Sign in again.");
    if (user.role !== "ADMIN") throw new HttpError(403, "Forbidden");
    const { code } = await context.params;
    const table = await requireActiveTable(code);
    const png = await QRCode.toBuffer(`${publicEnv.siteUrl}/m?table=${table.code}`, {
      type: "png",
      width: 640,
      margin: 1,
      errorCorrectionLevel: "M",
    });
    const download = new URL(request.url).searchParams.get("download") === "1";
    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        "Content-Disposition": download
          ? `attachment; filename="blue-diamond-${table.code}.png"`
          : "inline",
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
