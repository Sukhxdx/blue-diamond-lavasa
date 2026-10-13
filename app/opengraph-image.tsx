import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const alt = `${brand.villaName} villa and ${brand.hotelName} in Lavasa`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1c3330",
          color: "#f4efe6",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#c4a574" }}>
          LAVASA, MAHARASHTRA
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, lineHeight: 1 }}>{brand.villaName}</div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 12 }}>{brand.hotelName}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28 }}>Villa · Hotel rooms · North Indian restaurant</div>
      </div>
    ),
    { ...size },
  );
}
