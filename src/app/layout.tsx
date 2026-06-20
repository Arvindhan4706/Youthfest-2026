import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "YUVENZA 2026 | The Biggest Youth Festival of the Year",
  description:
    "5000+ students, 50+ events across Technology, Creativity, Gaming & Culture. August 12, 2026. Register now before spots run out!",
  keywords: [
    "youth festival 2026",
    "yuvenza",
    "college fest",
    "hackathon",
    "gaming tournament",
    "cultural fest",
    "student festival",
  ],
  openGraph: {
    title: "YUVENZA 2026 | The Biggest Youth Festival",
    description:
      "5000+ students. 50+ events. One legendary festival. August 12, 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#011213" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
