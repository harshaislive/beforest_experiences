import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LocationProvider } from "@/contexts/LocationContext";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Beforest Experiences",
  description: "Experience nature's finest moments with our community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <LocationProvider>
          <main className="min-h-screen bg-soft-beige">
            {children}
          </main>
        </LocationProvider>
      </body>
    </html>
  );
}
