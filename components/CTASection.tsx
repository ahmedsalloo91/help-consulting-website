import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CTASectionProps = {
  title?: string;
  description?: string;
};

export function CTASection({
  title = "Ready to move from personal effort to professional systems?",
  description = "Book a focused consultation with HELP Consulting and start building the structure your business needs for its next stage."
}: CTASectionProps) {
  return (
    <section className="bg-navy py-16 text-white sm:py-20">
      <div className="section-shell">
        <div className="relative overflow-hidden rounded-lg border border-white/12 bg-[linear-gradient(135deg,#1557D6_0%,#0C347F_100%)] px-6 py-10 shadow-[0_28px_80px_rgba(0,0,0,0.2)] sm:px-10 lg:px-12 lg:py-12">
          <div className="absolute -right-10 -top-12 h-44 w-44 border-[30px] border-white/15 hex-clip" />
          <div className="absolute -bottom-16 right-32 h-32 w-32 border-[22px] border-white/10 hex-clip" />
          <div className="relative max-w-3xl">
            <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/80">{description}</p>
            <Link href="/contact" className="btn-secondary mt-8 border-white bg-white">
              Book a Consultation <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
