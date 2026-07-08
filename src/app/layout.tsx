import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coffee House",
  description: "...",
  icons: {
    icon: "/coffee-bean-logo.svg",
    apple: "/coffee-bean-logo.svg",
  },
  themeColor: "#e8c79d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/coffee-bean-logo-no-bg.svg" />
        <link rel="icon" href="/coffee-bean-logo.svg" />
        <link rel="apple-touch-icon" href="/coffee-bean-logo-no-bg.svg" />
        <meta name="theme-color" content="#e8c79d" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="bottom-right" closeButton={true} duration={3000} />
      </body>
    </html>
  );
}
