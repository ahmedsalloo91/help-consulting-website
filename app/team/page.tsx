import { T } from "@/components/LanguageProvider";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { team } from "@/lib/content";

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Team"
        title="A focused consulting team across core business functions."
        description="HELP brings together complementary capabilities so businesses can address management, systems, people, market, and legal needs in one consulting relationship."
      />
      <section className="section-pad">
        <div className="section-shell grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <article key={member.name} className="premium-card p-6">
              <div className="hex-clip grid h-20 w-20 place-items-center bg-skyline text-2xl font-black text-royal ring-8 ring-white">
                {member.name.charAt(0)}
              </div>
              <h2 className="mt-6 text-2xl font-black text-navy"><T>{member.name}</T></h2>
              <p className="mt-2 text-sm font-bold text-royal"><T>{member.role}</T></p>
              <p className="mt-5 text-sm leading-7 text-graphite/72"><T>{member.bio}</T></p>
            </article>
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
