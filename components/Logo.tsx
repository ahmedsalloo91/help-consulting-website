import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  inverse?: boolean;
};

export function Logo({ inverse = false }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="HELP Consulting home">
      <span
        className={`grid h-12 w-12 place-items-center ${
          inverse ? "rounded-md bg-white p-2 shadow-[0_14px_30px_rgba(0,0,0,0.18)]" : ""
        }`}
      >
        <Image src="/help-logo.png" alt="" width={48} height={48} className="h-full w-full object-contain" priority />
      </span>
      <span className="leading-tight">
        <span className={`block text-lg font-extrabold tracking-tight ${inverse ? "text-white" : "text-navy"}`}>
          HELP
        </span>
        <span
          className={`block text-xs font-semibold uppercase tracking-[0.16em] ${
            inverse ? "text-white/60" : "text-graphite/70"
          }`}
        >
          Consulting
        </span>
      </span>
    </Link>
  );
}
