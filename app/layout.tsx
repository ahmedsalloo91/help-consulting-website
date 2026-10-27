import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionLayer } from "@/components/MotionLayer";
import { cookies, headers } from "next/headers";
import { LanguageProvider } from "@/components/LanguageProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const englishMetadata: Metadata = {
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

async function getLocale() {
  const saved = (await cookies()).get("help-language")?.value;
  const preferred = (await headers()).get("accept-language")?.split(",")[0] ?? "en";
  return saved === "ar" || (saved !== "en" && preferred.startsWith("ar")) ? "ar" : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  if (await getLocale() === "en") return englishMetadata;
  const title = "HELP للاستشارات | أنظمة مؤسسية للشركات النامية";
  const description = "ندعم الشركات النامية في العراق بحلول الاستراتيجية والموارد البشرية والمالية والتسويق والقانون والتكنولوجيا.";
  return { ...englishMetadata, title, description, openGraph: { title, description, type: "website", locale: "ar_IQ" } };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={inter.className}>
        <LanguageProvider locale={locale}>
        <MotionLayer />
        <Header />
        <main>{children}</main>
        <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
