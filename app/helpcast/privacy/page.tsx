import Link from "next/link";
import { T } from "@/components/LanguageProvider";

export const metadata = { title: "HELPCAST | الخصوصية / Application Privacy" };
export default function HelpcastPrivacy() {
  return <section className="section-shell max-w-3xl py-16">
    <h1 className="text-3xl font-bold"><T>HELPCAST application privacy</T></h1>
    <div className="mt-8 space-y-5 text-base leading-8 text-graphite">
      <p><T>We collect the details you submit to review your HELPCAST guest application and contact selected guests. Submission does not guarantee participation.</T></p>
      <p><T>Your application is emailed directly to info@consultations.help using our email provider. We do not keep an application database or a separate website copy. The email, including your consent, submission language and time, remains in the HELP mailbox and is handled by our email provider.</T></p>
      <p><T>Your text is sent as entered without automatic translation. Form drafts stay only in the current browser page. Temporary counters and digests help prevent spam and duplicate sends; they do not contain your application text. We do not log application contents.</T></p>
      <h2 className="pt-4 text-xl font-bold text-navy"><T>Optional marketing tracking</T></h2>
      <p><T>Only if you accept marketing cookies, Meta Pixel measures page visits and successful applications. Meta may receive browser and device information, page URLs, online identifiers and an anonymous application event reference, but we do not send your name, phone number, email or application answers as event parameters. Marketing consent is separate from permission to contact you about your application. You can reject or withdraw it using Cookie preferences in the footer without affecting your application. Your preference is stored in this browser; event references used to prevent duplicate conversions are kept for the browser session.</T></p>
      <p><T>For questions about your information or to request deletion, contact</T> <a href="mailto:info@consultations.help" className="text-royal underline"><bdi>info@consultations.help</bdi></a>.</p>
    </div>
    <Link href="/helpcast#apply" className="btn-secondary mt-8"><T>Back to application</T></Link>
  </section>;
}
