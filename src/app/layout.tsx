import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BoilerOps",
  description: "Industrial Boiler Logbook System",
};

import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "sonner";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
