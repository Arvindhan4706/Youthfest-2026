import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import AutoLogoutProvider from "../components/AutoLogoutProvider";
import "./globals.css";
const inter = Inter({
 variable: "--font-inter",
 subsets: ["latin"],
 display: "swap",
});

const spaceGrotesk = Space_Grotesk({
 variable: "--font-space-grotesk",
 subsets: ["latin"],
 display: "swap",
});
export const metadata: Metadata = {
 title: "Yuvenza | The Youth Club of CIT",
 description:
 "Yuvenza is the official youth club of Chennai Institute of Technology, dedicated to igniting passion, creativity, and unity while transforming every event into an opportunity to create meaningful social impact.",
 keywords: [
 "youth festival 2026",
 "youthfest",
 "college fest",
 "hackathon",
 "gaming tournament",
 "cultural fest",
 "student festival",
 ],
 metadataBase: new URL('https://youthfest2026.com'),
 openGraph: {
 title: "YUVENZA'S YOUTHFEST 2026 | The Biggest Youth Festival",
 description: "5000+ students. 50+ events. One legendary festival. August 12, 2026.",
 url: 'https://youthfest2026.com',
 siteName: 'Youthfest 2026',
 images: [
 {
 url: '/og-image.jpg',
 width: 1200,
 height: 630,
 alt: 'Youthfest 2026 Official Banner',
 },
 ],
 locale: 'en_IN',
 type: "website",
 },
 twitter: {
 card: 'summary_large_image',
 title: "YUVENZA'S YOUTHFEST 2026 | The Biggest Youth Festival",
 description: "5000+ students. 50+ events. One legendary festival. August 12, 2026.",
 images: ['/og-image.jpg'],
 },
};

import { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#050816',
};

import GlobalClientProviders from "../components/GlobalClientProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="min-h-screen font-sans">
        <AutoLogoutProvider />
        <GlobalClientProviders>
          {children}
        </GlobalClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
