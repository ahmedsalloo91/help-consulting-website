import { CTASection } from "@/components/CTASection";
import { IndustryCard } from "@/components/IndustryCard";
import { PageHero } from "@/components/PageHero";
import { industries } from "@/lib/content";

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Consulting for businesses with real operational complexity."
        description="HELP supports companies that need better control over people, costing, branches, inventory, sales, marketing, compliance, and reporting."
      />
      <section className="section-pad">
        <div className="section-shell grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <IndustryCard key={industry.title} {...industry} />
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
