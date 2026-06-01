import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/content";

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Integrated business consulting solutions."
        description="HELP covers the core functions that growing companies need to organize: strategy, people, numbers, market presence, legal structure, and technology."
      />
      <section className="section-pad">
        <div className="section-shell grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>
      <CTASection title="Need more than one service?" description="HELP can combine consulting tracks into one practical transformation plan for your business." />
    </>
  );
}
