"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { arabic } from "@/lib/arabic";
import { helpcastArabic } from "@/lib/helpcast-copy";
import { usePathname } from "next/navigation";

export type Locale = "en" | "ar";
const LanguageContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({ locale: "en", setLocale: () => {} });

export function LanguageProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const pathname = usePathname();
  const [generalLocale, setGeneralLocale] = useState(locale);
  const [helpcastLocale, setHelpcastLocale] = useState<Locale>("ar");
  const current = pathname?.startsWith("/helpcast") ? helpcastLocale : generalLocale;
  useEffect(() => {
    document.documentElement.lang = current;
    document.documentElement.dir = current === "ar" ? "rtl" : "ltr";
  }, [current]);
  const setLocale = (next: Locale) => {
    document.cookie = `help-language=${next};path=/;max-age=31536000;SameSite=Lax`;
    setGeneralLocale(next);
    setHelpcastLocale(next);
  };
  return <LanguageContext.Provider value={{ locale: current, setLocale }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const { locale, setLocale } = useContext(LanguageContext);
  const t = (text: string) => locale === "ar" ? helpcastArabic[text.replace(/\s+/g, " ").trim()] ?? arabic[text.replace(/\s+/g, " ").trim()] ?? text : text;
  return { locale, setLocale, t };
}

export function T({ children }: { children: string }) {
  const { t } = useLanguage();
  return <>{t(children)}</>;
}

export function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();
  return (
    <div className="language-switch" dir="ltr" role="group" aria-label={locale === "ar" ? "لغة الموقع" : "Website language"}>
      <button type="button" lang="ar" aria-label="العربية" aria-pressed={locale === "ar"} onClick={() => setLocale("ar")}>AR</button>
      <span aria-hidden>|</span>
      <button type="button" lang="en" aria-label="English" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>EN</button>
    </div>
  );
}
