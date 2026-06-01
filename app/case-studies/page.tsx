import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { caseStudies } from "@/lib/content";

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="Practical transformation examples."
        description="These examples show the types of business problems HELP Consulting is designed to solve through structured, practical consulting tracks."
      />
      <section className="section-pad">
        <div className="section-shell grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.title} {...study} />
          ))}
        </div>
      </section>
      <CTASection title="Have a similar business challenge?" description="Share where the pressure is showing up, and HELP will map the first consulting priorities." />
    </>
  );
}
