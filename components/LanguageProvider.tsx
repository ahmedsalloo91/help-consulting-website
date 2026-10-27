"use client";

import { createContext, useContext } from "react";
import { Languages } from "lucide-react";
import { arabic } from "@/lib/arabic";

export type Locale = "en" | "ar";
const LanguageContext = createContext<Locale>("en");

export function LanguageProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LanguageContext.Provider value={locale}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const locale = useContext(LanguageContext);
  const t = (text: string) => locale === "ar" ? arabic[text.replace(/\s+/g, " ").trim()] ?? text : text;
  return { locale, t };
}

export function T({ children }: { children: string }) {
  const { t } = useLanguage();
  return <>{t(children)}</>;
}

export function LanguageSwitch() {
  const { locale } = useLanguage();
  const next = locale === "en" ? "ar" : "en";
  return (
    <button type="button" className="language-switch" lang={next} aria-label={next === "ar" ? "التبديل إلى العربية" : "Switch to English"}
      onClick={() => {
        document.cookie = `help-language=${next};path=/;max-age=31536000;SameSite=Lax`;
        window.location.reload();
      }}>
      <Languages size={18} aria-hidden />{next === "ar" ? "العربية" : "English"}
    </button>
  );
}
