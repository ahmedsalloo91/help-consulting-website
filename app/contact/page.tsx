import { Mail, MapPin, Phone, CalendarDays, Clock3, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { T } from "@/components/LanguageProvider";
import { BookingCalendar } from "@/components/BookingCalendar";
import { bookingUrl } from "@/lib/booking";

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Book a consultation with HELP Consulting."
        description="Share your business need and the team will help identify the first priorities for a practical consulting engagement." />
      <section className="section-pad">
        <div className="section-shell grid items-start gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <aside className="rounded-lg bg-navy p-6 text-white sm:p-8">
            <h2 className="text-2xl font-bold"><T>Contact Details</T></h2>
            <p className="mt-4 text-sm leading-7 text-white/80"><T>Tell us where the business needs more structure, and we will help identify the first consulting priorities.</T></p>
            <div className="mt-7 grid gap-5 text-sm">
              <p className="flex items-center gap-3"><MapPin size={19} aria-hidden /><T>Iraq</T></p>
              <a className="flex items-center gap-3 hover:underline" href="mailto:info@consultations.help"><Mail size={19} className="shrink-0" aria-hidden /><bdi>info@consultations.help</bdi></a>
              <a className="flex items-center gap-3 hover:underline" href="tel:+9647702750447"><Phone size={19} aria-hidden /><bdi>+9647702750447</bdi></a>
              <a className="flex items-center gap-3 hover:underline" href="tel:+9647802454247"><Phone size={19} aria-hidden /><bdi>+9647802454247</bdi></a>
            </div>
            <div className="mt-8 border-t border-white/20 pt-6">
              <h3 className="font-semibold"><T>General enquiries</T></h3>
              <p className="mt-3 text-sm leading-7 text-white/80"><T>For other questions, email our team.</T></p>
            </div>
          </aside>
          <div id="booking" className="min-w-0">
            <p className="eyebrow"><T>Book your 30-minute consultation</T></p>
            <h2 className="mt-3 text-3xl font-bold"><T>Choose a day and time</T></h2>
            <p className="mt-5 flex items-start gap-2 text-sm leading-7 text-graphite"><CalendarDays className="mt-1 shrink-0" size={18} aria-hidden /><T>Saturday–Thursday · 10:00 AM–7:00 PM · Baghdad time</T></p>
            <p className="mt-2 flex items-start gap-2 text-sm leading-7 text-graphite"><Clock3 className="mt-1 shrink-0" size={18} aria-hidden /><T>Last appointment starts at 6:30 PM. Fridays are unavailable.</T></p>
            <p className="my-5 text-sm leading-7 text-graphite"><T>Your appointment is confirmed after you complete the booking in Calendly. A Google Meet link will be included in your confirmation.</T></p>
            <BookingCalendar />
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-5 gap-2"><T>Open booking calendar</T><ExternalLink size={17} aria-hidden /></a>
          </div>
        </div>
      </section>
    </>
  );
}
