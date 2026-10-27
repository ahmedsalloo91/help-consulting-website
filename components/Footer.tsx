import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navItems, services } from "@/lib/content";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="section-shell grid gap-10 py-14 sm:py-16 lg:grid-cols-[1.35fr_0.7fr_0.9fr]">
        <div>
          <Logo inverse />
          <p className="mt-6 max-w-md text-sm leading-7 text-white/72"><T>{"HELP Consulting supports growing businesses in Iraq with practical systems across strategy, people, finance, marketing, legal, and technology."}</T></p>
          <div className="mt-7 grid gap-3 text-sm text-white/72">
            <span className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2">
              <MapPin className="h-4 w-4 text-white" /><T>{"Iraq"}</T></span>
            <span className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2">
              <Mail className="h-4 w-4 shrink-0 text-white" /> <a href="mailto:info@consultations.help"><bdi>info@consultations.help</bdi></a>
            </span>
            <span className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2">
              <Phone className="h-4 w-4 shrink-0 text-white" /> <a href="tel:+9647702750447"><bdi>+9647702750447</bdi></a>
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/50"><T>{"Pages"}</T></h2>
          <div className="mt-5 grid gap-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-semibold text-white/72 hover:text-white">
                <T>{item.label}</T>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/50"><T>{"Solutions"}</T></h2>
          <div className="mt-5 grid gap-3">
            {services.map((service) => (
              <span key={service.title} className="text-sm font-semibold text-white/72">
                <T>{service.title}</T>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="section-shell flex flex-col gap-2 text-xs text-white/56 sm:flex-row sm:items-center sm:justify-between">
          <p><T>{"© 2026 HELP Consulting. All rights reserved."}</T></p>
          <p><T>{"Professional systems for growing businesses."}</T></p>
        </div>
      </div>
    </footer>
  );
}
