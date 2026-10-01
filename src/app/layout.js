import {
  Big_Shoulders,
  Big_Shoulders_Inline,
  Jost,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

// Self-hosted by next/font: no request to Google, no layout shift.
// Big Shoulders is drawn from 1930s Chicago signage; the opsz axis lets it
// tighten up at display sizes. Jost follows Futura (1927). Space Mono covers
// small labels and the "typed" details.
// next/font has no metrics to size an automatic fallback for Big Shoulders,
// so name condensed fallbacks explicitly instead. (Font loader options must
// be literals, hence the repetition.)
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-big-shoulders",
  display: "swap",
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
  adjustFontFallback: false,
});
const inline = Big_Shoulders_Inline({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-big-shoulders-inline",
  display: "swap",
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
  adjustFontFallback: false,
});
const body = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});
const mono = Space_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-space-mono",
  display: "swap",
});

// One place to change when a custom domain is connected. Set the same value
// in Vercel > Settings > Environment Variables.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://youssef-eslam29.vercel.app";

const title = "Youssef Eslam Hussein | Software & Web Developer";
const description =
  "Portfolio of Youssef Eslam Hussein, a Computer Engineering student at AASTMT who builds web applications with React and Next.js and works on ROS 2 robotics and machine learning projects.";
const shortDescription =
  "Projects in full-stack web development, ROS 2 robotics, and machine learning.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "Youssef Eslam",
    "Software Developer",
    "Web Developer",
    "Full Stack",
    "Next.js",
    "React",
    "JavaScript",
    "Portfolio",
    "XIXYA",
    "Computer Engineering",
    "AWS",
    "Robotics",
  ],
  authors: [{ name: "Youssef Eslam Hussein" }],
  creator: "Youssef Eslam Hussein",
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: shortDescription,
    url: siteUrl,
    siteName: "Youssef Eslam Hussein",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: shortDescription,
    creator: "@XIXYA_29",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  // The top of the hero sky, so the browser chrome runs into it.
  themeColor: "#2A0507",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${inline.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        {/* Scroll reveals start hidden and are revealed by JS. With scripting
            off nothing would ever reveal them, so show them outright. */}
        <noscript>
          <style>{`.reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger-children > *{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
