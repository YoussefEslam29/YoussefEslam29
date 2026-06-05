import "./globals.css";

export const metadata = {
  title: "Youssef Eslam Hussein — Software & Web Developer",
  description:
    "Portfolio of Youssef Eslam Hussein — Computer Engineering student, full-stack developer, cloud enthusiast, and robotics builder. Specializing in JavaScript, React, Next.js, and AWS.",
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
  openGraph: {
    title: "Youssef Eslam Hussein — Software & Web Developer",
    description:
      "Bold portfolio showcasing full-stack projects, cloud architecture, and robotics. Built different.",
    url: "https://youssefeslam.dev",
    siteName: "Youssef Eslam Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Youssef Eslam Hussein — Software & Web Developer",
    description:
      "Bold portfolio showcasing full-stack projects, cloud architecture, and robotics.",
    creator: "@XIXYA_29",
  },
  robots: {
    index: true,
    follow: true,
  },
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
      </head>
      <body>{children}</body>
    </html>
  );
}
