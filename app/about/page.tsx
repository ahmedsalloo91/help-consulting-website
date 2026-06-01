import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About HELP"
        title="A consulting partner for businesses ready to professionalize."
        description="HELP Consulting is based in Iraq and supports growing companies that want stronger systems, clearer accountability, and better decisions across the business."
      />
      <section className="section-pad">
        <div className="section-shell grid gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Our Role"
            title="We help owners and teams make the business less dependent on personal effort."
            description="A growing business often reaches a point where informal decisions, unclear roles, weak reporting, and scattered tools start slowing momentum. HELP works across strategy, HR, finance, marketing, legal, and technology to create professional systems that can be managed, measured, and improved."
          />
          <div className="premium-card p-8 lg:p-10">
            <h2 className="text-2xl font-black text-navy">What makes the work practical</h2>
            <div className="mt-6 grid gap-5 text-sm leading-7 text-graphite/72">
              <p>We start with the real operating model, not a generic template.</p>
              <p>We turn recommendations into documents, workflows, dashboards, and management routines.</p>
              <p>We support SMEs, family businesses, and active operators that need structure without unnecessary complexity.</p>
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
