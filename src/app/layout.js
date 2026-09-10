import "./globals.css";

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
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
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
