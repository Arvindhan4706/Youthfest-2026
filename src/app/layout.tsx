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
 "Yuvenza is the official youth club of Chennai Institute of Technology. What we create, we contribute, transforming every event into an opportunity to create meaningful social impact.",
 keywords: [
 "youth festival 2026",
 "yuvenza",
 "college fest",
 "hackathon",
 "gaming tournament",
 "cultural fest",
 "student festival",
 ],
 metadataBase: new URL('https://yuvenza2026.com'),
 openGraph: {
 title: "YUVENZA'S YUVENZA 2026 | The Biggest Youth Festival",
 description: "5000+ students. 50+ events. One legendary festival. August 21, 2026.",
 url: 'https://yuvenza2026.com',
 siteName: 'Yuvenza',
 images: [
 {
 url: '/hero-logo.png',
 width: 1200,
 height: 630,
 alt: 'Yuvenza Official Banner',
 },
 ],
 locale: 'en_IN',
 type: "website",
 },
 twitter: {
  card: 'summary_large_image',
  title: 'YUVENZA 2026 | The Biggest Youth Festival',
  description: '5000+ students. 50+ events. One legendary festival.',
  images: ['/hero-logo.png'],
 },
 robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://yuvenza2026.com',
  },
};

import { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#050816',
};

import GlobalClientProviders from "../components/GlobalClientProviders";
import ScrollProgress from "../components/ui/ScrollProgress";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="min-h-screen font-sans">
        <AutoLogoutProvider />
        <ScrollProgress />
        <GlobalClientProviders>
          {children}
        </GlobalClientProviders>
        <Analytics />
      </body>
    </html>
  );
}

