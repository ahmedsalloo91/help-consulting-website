"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { bookingUrl } from "@/lib/booking";

export function BookingCalendar() {
  const { t } = useLanguage();
  // Calendly owns availability, conflict checking, and booking confirmations.
  return <iframe
    title={t("Book your 30-minute consultation")}
    src={`${bookingUrl}?embed_type=Inline&embed_domain=www.consultations.help&primary_color=1557d6`}
    className="block h-[1050px] w-full rounded-lg border border-slate-200 bg-white sm:h-[900px]"
    loading="lazy"
    referrerPolicy="strict-origin-when-cross-origin"
  />;
}
