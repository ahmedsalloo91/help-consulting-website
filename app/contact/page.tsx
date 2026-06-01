import { Mail, MapPin, Phone, Send } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Book a consultation with HELP Consulting."
        description="Share your business need and the team will help identify the first priorities for a practical consulting engagement."
      />
      <section className="section-pad">
        <div className="section-shell grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
          <aside className="relative overflow-hidden rounded-lg bg-navy p-7 text-white shadow-[0_22px_70px_rgba(7,27,58,0.16)] sm:p-8 lg:p-10">
            <div className="absolute -right-12 -top-12 h-40 w-40 border-[28px] border-white/10 hex-clip" />
            <h2 className="relative text-2xl font-black">Contact Details</h2>
            <p className="mt-4 text-sm leading-7 text-white/72">
              Tell us where the business needs more structure, and we will help identify the first consulting priorities.
            </p>
            <div className="relative mt-8 grid gap-3 text-sm text-white/76">
              <span className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-3">
                <MapPin className="h-5 w-5 shrink-0 text-white" /> Iraq
              </span>
              <span className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-3">
                <Mail className="h-5 w-5 shrink-0 text-white" /> info@consultations.help
              </span>
              <span className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-3">
                <Phone className="h-5 w-5 shrink-0 text-white" /> +964 000 000 0000
              </span>
            </div>
            <div className="relative mt-10 border-t border-white/10 pt-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/45">Engagement Focus</p>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Strategy, people, finance, marketing, legal, and technology systems for growing companies.
              </p>
            </div>
          </aside>
          <form className="premium-card p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <p className="eyebrow">Inquiry Form</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-navy sm:text-3xl">Tell us what needs structure.</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-navy">
                Full Name
                <input className="field" placeholder="Your name" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Company
                <input className="field" placeholder="Company name" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Email
                <input type="email" className="field" placeholder="you@example.com" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Phone
                <input className="field" placeholder="+964" />
              </label>
            </div>
            <label className="mt-5 grid gap-2 text-sm font-bold text-navy">
              Consulting Need
              <select className="field" defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                <option>Strategy & Business Transformation</option>
                <option>HR Consulting</option>
                <option>Finance & Economic Advisory</option>
                <option>Marketing & PR</option>
                <option>Legal Support</option>
                <option>Tech Solutions</option>
              </select>
            </label>
            <label className="mt-5 grid gap-2 text-sm font-bold text-navy">
              Message
              <textarea className="field min-h-40 resize-y" placeholder="What do you want to improve or systemize?" />
            </label>
            <button
              type="button"
              className="btn-primary mt-7 w-full sm:w-auto"
            >
              Submit Inquiry <Send className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
