import type { LucideIcon } from "lucide-react";

type IndustryCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function IndustryCard({ title, description, icon: Icon }: IndustryCardProps) {
  return (
    <article className="group premium-card flex min-h-44 gap-4 p-5 sm:p-6">
      <div className="hex-clip grid h-12 w-12 shrink-0 place-items-center bg-navy text-white shadow-[0_14px_24px_rgba(7,27,58,0.18)] transition duration-500 group-hover:bg-royal">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <h3 className="text-lg font-black leading-snug text-navy">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-graphite/72">{description}</p>
      </div>
    </article>
  );
}
