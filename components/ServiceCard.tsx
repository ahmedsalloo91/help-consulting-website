import type { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function ServiceCard({ title, description, icon: Icon }: ServiceCardProps) {
  return (
    <article className="group premium-card relative min-h-72 overflow-hidden p-6 sm:p-7">
      <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 bg-skyline hex-clip" />
      <div className="hex-clip grid h-14 w-14 place-items-center bg-skyline text-royal ring-8 ring-skyline/40 transition group-hover:bg-royal group-hover:text-white">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="relative mt-8 text-xl font-black leading-snug tracking-tight text-navy">{title}</h3>
      <p className="relative mt-4 text-sm leading-7 text-graphite/72">{description}</p>
    </article>
  );
}
