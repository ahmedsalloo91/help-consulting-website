type CaseStudyCardProps = {
  title: string;
  description: string;
  tags: string[];
};

export function CaseStudyCard({ title, description, tags }: CaseStudyCardProps) {
  return (
    <article className="premium-card overflow-hidden p-5 sm:p-6">
      <div className="relative h-28 overflow-hidden rounded-md bg-[linear-gradient(135deg,#071B3A_0%,#1557D6_54%,#EAF1FF_54%,#F8FAFC_100%)]">
        <div className="absolute right-7 top-5 h-16 w-16 border-[12px] border-white/35 hex-clip" />
      </div>
      <h3 className="mt-6 text-xl font-black leading-snug text-navy">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-graphite/72">{description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded bg-skyline px-3 py-1.5 text-xs font-extrabold text-royal">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
