import { ImageResponse } from "next/og";

export const alt = "Youssef Eslam Hussein, Software and Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Typography on a flat ground. No gradient, no stock photography.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#050508",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#F0E6FF",
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          Youssef Eslam Hussein
        </div>
        <div style={{ display: "flex", marginTop: 24, color: "#A855F7", fontSize: 36 }}>
          Software &amp; Web Developer
        </div>
        <div style={{ display: "flex", marginTop: 16, color: "#A8A0BF", fontSize: 26 }}>
          Web applications, ROS 2 robotics, machine learning
        </div>
      </div>
    ),
    size
  );
}
