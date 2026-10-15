import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "8px",
          color: "#FFA5D5",
          fontFamily: "BlockBerthold",
          fontSize: "20px",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.5px",
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
