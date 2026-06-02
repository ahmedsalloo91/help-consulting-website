import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionLayer } from "@/components/MotionLayer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.consultations.help"),
  title: "HELP Consulting | Professional Systems for Growing Businesses",
  description:
    "HELP Consulting supports growing businesses in Iraq with strategy, HR, finance, marketing, legal, and technology solutions.",
  openGraph: {
    title: "HELP Consulting | Professional Systems for Growing Businesses",
    description:
      "Strategy, HR, finance, marketing, legal, and technology consulting for growing businesses in Iraq.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MotionLayer />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
