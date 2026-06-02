import Link from "next/link";
import { Menu } from "lucide-react";
import { navItems } from "@/lib/content";
import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl transition-shadow duration-300">
      <div className="section-shell flex h-[76px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 rounded-md border border-slate-200 bg-slate-50/70 p-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-sm font-bold text-graphite/78 transition hover:bg-white hover:text-royal"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/contact" className="btn-primary px-5">
            Book a Consultation
          </Link>
        </div>
        <details className="relative lg:hidden">
          <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-md border border-slate-200 bg-white text-navy shadow-sm">
            <Menu className="h-5 w-5" aria-hidden />
            <span className="sr-only">Open navigation</span>
          </summary>
          <nav className="absolute right-0 mt-3 grid w-64 gap-1 rounded-lg border border-slate-200 bg-white p-3 shadow-soft">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-3 text-sm font-bold text-graphite hover:bg-skyline hover:text-royal"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
