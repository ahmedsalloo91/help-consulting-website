type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
};

export function SectionHeading({ eyebrow, title, description, align = "left", inverse = false }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className={inverse ? "text-sm font-semibold uppercase tracking-[0.18em] text-white/60" : "eyebrow"}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl ${inverse ? "text-white" : "text-navy"}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 text-base leading-8 sm:text-lg ${inverse ? "text-white/70" : "text-graphite/72"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
