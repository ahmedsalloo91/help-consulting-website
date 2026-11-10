import type { Metadata } from "next";
import { Helpcast } from "@/components/Helpcast";

const title = "HELPCAST | قصتك تستحق أن تُروى | Business Stories";
const description = "بودكاست الأعمال من HELP للاستشارات. قدّم طلب استضافتك. Business stories and strategic insights from Iraq. Apply to be a HELPCAST guest.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/helpcast" },
  openGraph: { title, description, url: "/helpcast", type: "website", locale: "ar_IQ", alternateLocale: "en_US", images: [{ url: "/helpcast-logo.png", width: 1774, height: 887, alt: "HELPCAST" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/helpcast-logo.png"] }
};

export default function HelpcastPage() { return <Helpcast />; }
