import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/common/navbar";
import { SessionProvider } from "next-auth/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bookolia - Showcase Your Book Portfolios",
  description:
    "Bookolia is a platform where users can create and share their book portfolios. Join using Google and explore a wide range of book collections curated by the community.",
  keywords: [
    "bookolia",
    "book portfolio",
    "book sharing platform",
    "google sign-in",
    "book collection",
    "online book portfolios",
  ],
  authors: [{ name: "Tareq Mahmood", url: "https://bookolia.vercel.app" }],
  creator: "Your Name",
  openGraph: {
    title: "Bookolia - Showcase Your Book Portfolios",
    description:
      "Bookolia is a platform where users can create and share their book portfolios. Join using Google and explore a wide range of book collections curated by the community.",
    url: "https://bookolia.vercel.app",
    siteName: "Bookolia",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookolia - Showcase Your Book Portfolios",
    description:
      "Bookolia is a platform where users can create and share their book portfolios. Join using Google and explore a wide range of book collections curated by the community.",
    site: "@bookolia",
    creator: "@yourtwitterhandle",
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Navbar />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
