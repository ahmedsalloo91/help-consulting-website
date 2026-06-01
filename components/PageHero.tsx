type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="absolute right-[7%] top-10 h-32 w-32 border-[22px] border-skyline hex-clip" />
      <div className="absolute bottom-8 left-[6%] h-20 w-20 bg-skyline/80 hex-clip" />
      <div className="section-shell relative">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-navy sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-graphite/72 sm:text-xl">{description}</p>
      </div>
    </section>
  );
}
