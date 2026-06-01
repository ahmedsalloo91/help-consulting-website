import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CTASection } from "@/components/CTASection";
import { IndustryCard } from "@/components/IndustryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { caseStudies, industries, services, team, workSteps } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute right-0 top-0 hidden h-full w-1/2 bg-skyline/70 [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)] sm:block" />
        <div className="absolute right-[10%] top-24 h-40 w-40 border-[28px] border-royal/10 hex-clip" />
        <div className="section-shell relative grid min-h-[calc(100vh-76px)] items-center gap-12 py-14 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div>
            <p className="eyebrow">HELP Consulting</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-6xl">
              Helping Businesses Move From Personal Effort to Professional Systems
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite/75 sm:text-xl">
              HELP Consulting supports growing businesses with strategy, HR, finance, marketing, legal,
              and technology solutions.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Book a Consultation <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/services" className="btn-secondary">
                Our Services
              </Link>
            </div>
          </div>
          <div className="relative pb-8">
            <div className="grid grid-cols-2 gap-4">
              {["Strategy", "People", "Finance", "Tech"].map((label, index) => (
                <div
                  key={label}
                  className={`premium-card p-5 sm:p-6 ${
                    index % 2 ? "translate-y-6 sm:translate-y-8" : ""
                  }`}
                >
                  <div className="hex-clip mb-8 h-12 w-12 bg-royal/15 ring-8 ring-skyline/50" />
                  <p className="text-2xl font-black text-navy">0{index + 1}</p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-graphite/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="What We Do"
            title="We turn growth pressure into clear operating systems."
            description="Many businesses grow through the personal effort of owners and key people. HELP builds the structure, roles, reports, tools, and routines needed to scale with less friction."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {["Clear strategy", "Defined roles", "Financial visibility", "Technology enablement"].map((item) => (
              <div key={item} className="premium-card flex min-h-24 gap-3 p-5">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-royal" aria-hidden />
                <p className="text-base font-black text-navy">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Our Services"
            title="Specialized consulting across the core business functions."
            description="Each solution is practical, documented, and built around the way the business actually operates."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Industries We Serve"
            title="Built for SMEs, operators, and family businesses in active markets."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {industries.slice(0, 6).map((industry) => (
              <IndustryCard key={industry.title} {...industry} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy text-white">
        <div className="section-shell">
          <SectionHeading
            eyebrow="How We Work"
            title="A simple consulting process that keeps momentum visible."
            description="We work with management teams from diagnosis to measurable improvement."
            inverse
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {workSteps.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-white/12 bg-white/[0.07] p-6">
                <span className="text-sm font-black text-white/52">0{index + 1}</span>
                <h3 className="mt-5 text-xl font-black text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Case Studies Preview"
            title="Examples of the business problems HELP is built to solve."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.title} {...study} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="section-shell">
          <SectionHeading eyebrow="Meet the Team" title="A multidisciplinary team for practical transformation." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <article key={member.name} className="premium-card p-6">
                <div className="hex-clip grid h-16 w-16 place-items-center bg-skyline text-xl font-black text-royal ring-8 ring-white">
                  {member.name.charAt(0)}
                </div>
                <h3 className="mt-6 text-xl font-black text-navy">{member.name}</h3>
                <p className="mt-1 text-sm font-extrabold text-royal">{member.role}</p>
                <p className="mt-4 text-sm leading-7 text-graphite/72">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
