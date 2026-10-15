import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  const fontData = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/blockberthold.otf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#5B2302",
          borderRadius: "40px",
          color: "#FFA5D5",
          fontFamily: "BlockBerthold",
          fontSize: "108px",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-2px",
        }}
      >
        GC
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "BlockBerthold",
          data: fontData,
          style: "normal",
          weight: 900,
        },
      ],
    }
  );
}
