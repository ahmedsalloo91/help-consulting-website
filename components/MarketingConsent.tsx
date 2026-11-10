"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { MARKETING_CONSENT_KEY, MarketingConsent, pixelReady, privacySignal, setMarketingConsent, trackPageView, validPixelId } from "@/lib/meta-pixel";

const OPEN_PREFERENCES = "help:marketing-preferences";
export function MarketingPreferences() {
  const { t } = useLanguage();
  return <button type="button" className="text-start underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-offset-4" onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES))}>{t("Cookie preferences")}</button>;
}

export function MarketingConsentBanner() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();
  const [choice, setChoice] = useState<MarketingConsent | null>(null);
  const [visible, setVisible] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    function restore() {
      const signal = privacySignal();
      let saved: string | null = null;
      try { saved = localStorage.getItem(MARKETING_CONSENT_KEY); } catch { /* Ask again if storage is unavailable. */ }
      const next = signal ? "rejected" : saved === "accepted" || saved === "rejected" ? saved : null;
      setBlocked(signal);
      setMarketingConsent(next === "accepted");
      setChoice(next);
      setVisible(next === null);
    }
    const open = () => setVisible(true);
    const sync = (event: StorageEvent) => { if (event.key === MARKETING_CONSENT_KEY || event.key === null) restore(); };
    restore();
    window.addEventListener(OPEN_PREFERENCES, open);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(OPEN_PREFERENCES, open); window.removeEventListener("storage", sync); };
  }, []);

  useEffect(() => { if (choice === "accepted") trackPageView(pathname); }, [choice, pathname]);

  function choose(next: MarketingConsent) {
    setMarketingConsent(next === "accepted");
    try { localStorage.setItem(MARKETING_CONSENT_KEY, next); } catch { /* This choice remains valid for the current page. */ }
    setChoice(next); setVisible(false);
  }

  if (!validPixelId()) return null;
  return <>
    {choice === "accepted" && !blocked && <Script id="help-meta-pixel" src="https://connect.facebook.net/en_US/fbevents.js" strategy="afterInteractive" onReady={pixelReady} />}
    {visible && <section aria-label={t("Marketing cookies")} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="fixed inset-x-0 bottom-0 z-[100] max-h-[80dvh] overflow-y-auto border-t border-slate-200 bg-white px-5 py-5 text-navy shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex-1"><h2 className="text-base font-bold">{t("Marketing cookies")}</h2>
          <p className="mt-2 text-sm leading-6 text-graphite">{t("With your permission, Meta Pixel measures page visits and successful HELPCAST applications to improve our advertising. It may use cookies and online identifiers. We do not send your application answers to Meta. Rejecting does not affect your application.")}</p>
          {blocked && <p className="mt-2 text-sm">{t("Your browser privacy signal is respected. Marketing tracking is disabled.")}</p>}
          <Link className="mt-2 inline-block text-sm text-royal underline underline-offset-4" href="/helpcast/privacy">{t("Privacy policy")}</Link>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button type="button" className="btn-secondary !px-5 !py-3" onClick={() => choose("rejected")}>{t("Reject marketing")}</button>
          {!blocked && <button type="button" className="btn-secondary !px-5 !py-3" onClick={() => choose("accepted")}>{t("Accept marketing")}</button>}
        </div>
      </div>
    </section>}
  </>;
}
