import { ImageResponse } from "next/og";

export const alt = "Youssef Eslam Hussein, Software and Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The hero in miniature: crimson sky, a moon, a black skyline, and the name
// set like a poster. Flat shapes only, so it renders the same everywhere.
const TOWERS = [
  // [left, width, height]
  [560, 70, 150], [626, 90, 230], [712, 60, 180], [768, 110, 330],
  [874, 70, 250], [940, 120, 400], [1056, 64, 280], [1116, 84, 360],
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(180deg, #1E0406 0%, #4A0A0D 30%, #8E1418 62%, #C6261F 100%)",
        }}
      >
        {/* Moon */}
        <div
          style={{
            position: "absolute",
            left: 880,
            top: 70,
            width: 220,
            height: 220,
            borderRadius: 9999,
            background: "#E4452F",
          }}
        />
        {/* Skyline */}
        {TOWERS.map(([left, width, height]) => (
          <div
            key={left}
            style={{
              position: "absolute",
              left,
              bottom: 0,
              width,
              height,
              background: "#0D0708",
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, background: "#0D0708", display: "flex" }} />
        {/* Name */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 150,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#F4E7D3",
              fontSize: 120,
              fontWeight: 800,
              letterSpacing: "-0.01em",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Youssef
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 12,
              color: "#F2B544",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Eslam Hussein
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              padding: "10px 18px",
              background: "rgba(13, 7, 8, 0.75)",
              border: "1px solid rgba(201, 161, 90, 0.5)",
              color: "#F2B544",
              fontSize: 24,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Software &amp; Web Developer
          </div>
        </div>
      </div>
    ),
    size
  );
}
