"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, CheckCircle2, LoaderCircle, Mic2 } from "lucide-react";
import { T, useLanguage } from "@/components/LanguageProvider";
import { ApplicationValues, blankApplication, FieldErrors, sectors, validateApplication } from "@/lib/helpcast-validation";
import { trackHelpcastLead } from "@/lib/meta-pixel";

const topics = ["Strategy & business development", "Leadership & people", "Marketing, sales & growth", "Business environment & challenges", "Digital transformation", "Entrepreneurship"];
const labels = {
  full_name: "Full Name", company_name: "Company or Project Name", position: "Job Title",
  industry: "Industry / Sector", phone: "Phone / WhatsApp", email: "Email Address",
  introduction: "Tell us briefly about your company and experience"
};

export function Helpcast() {
  const { locale, t } = useLanguage();
  const [values, setValues] = useState<ApplicationValues>({ ...blankApplication });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [failure, setFailure] = useState("");
  const pending = useRef(false);
  const submissionId = useRef<string | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLDivElement>(null);

  function change(key: keyof ApplicationValues, value: string | boolean) {
    setValues(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
    // A changed application is a new attempt; unchanged network retries reuse the ID.
    submissionId.current = null;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const nextErrors = validateApplication(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    pending.current = true;
    setState("submitting");
    setFailure("");
    submissionId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/helpcast", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, language: locale, submission_id: submissionId.current, website: new FormData(event.currentTarget).get("website") }),
        signal: AbortSignal.timeout(20000)
      });
      const result = await response.json();
      if (response.ok && result.ok) {
        setState("success");
        trackHelpcastLead(result.event_id);
        requestAnimationFrame(() => success.current?.focus());
      } else {
        setErrors(result.errors ?? {});
        setFailure(result.code === "limited" ? "Too many attempts. Please try again in an hour." : result.code === "validation" ? "Please check the highlighted fields." : "We could not submit your application. Your information is still here; please try again later.");
        setState("error");
      }
    } catch {
      setFailure("We could not submit your application. Your information is still here; please try again later.");
      setState("error");
    } finally { pending.current = false; }
  }

  const errorFor = (key: keyof ApplicationValues) => errors[key] ? <span id={`${key}-error`} className="text-sm text-red-700">{t(errors[key]!)}</span> : null;
  const attributes = (key: keyof typeof labels) => ({
    id: key, name: key, required: key !== "email", "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${key}-error` : undefined
  });
  const textField = (key: "full_name" | "company_name" | "position" | "phone" | "email", placeholder: string, autoComplete: string) => (
    <div className="grid content-start gap-2">
      <label htmlFor={key} className="text-sm font-semibold">{t(labels[key])} {key === "email" ? <span className="font-normal text-graphite">({t("Optional")})</span> : <span aria-hidden>*</span>}</label>
      <input {...attributes(key)} className="field w-full" type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
        dir={key === "phone" || key === "email" ? "ltr" : "auto"} autoComplete={autoComplete} maxLength={key === "email" ? 254 : key === "phone" ? 60 : 200}
        placeholder={t(placeholder)} value={values[key]} onChange={e => change(key, e.target.value)} />
      {errorFor(key)}
    </div>
  );

  return <div className="helpcast-page" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
    <section className="border-b border-slate-200 bg-white">
      <div className="section-shell pb-12 pt-10 sm:pb-16 sm:pt-14">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5 text-xs font-semibold text-graphite sm:text-sm">
          <span className="flex items-center gap-2"><Mic2 size={16} aria-hidden /><T>Founding Season</T></span>
          <span><T>A business podcast by HELP Consulting.</T></span>
        </div>
        <div className="mx-auto max-w-3xl pt-8 text-center sm:pt-10">
          <Image src="/helpcast-logo.png" width={1774} height={887} alt="HELPCAST" priority className="mx-auto h-auto w-[300px] max-w-full sm:w-[400px]" />
          <p className="mt-3 text-sm font-semibold text-royal"><T>Business Stories. Strategic Insights.</T></p>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-navy sm:text-5xl"><T>Your story deserves to be told.</T></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-graphite"><T>A business podcast by HELP Consulting. We host company founders, CEOs and business leaders to explore their experiences, strategies and challenges in the Iraqi market.</T></p>
          <a href="#apply" className="btn-primary mt-7"><T>Apply to be a guest</T><ArrowDown size={17} aria-hidden /></a>
        </div>
      </div>
    </section>
    <section className="section-shell py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div><h2 className="text-2xl font-bold sm:text-3xl"><T>Conversations that move business forward</T></h2>
          <p className="mt-4 text-sm leading-7 text-graphite"><T>Sharing real business experiences to contribute to the development of Iraq&apos;s private sector.</T></p></div>
        <ul className="grid gap-x-8 sm:grid-cols-2">{topics.map((topic, index) => <li key={topic} className="flex items-center gap-3 border-b border-slate-200 py-4 text-sm font-semibold"><span className="text-xs text-royal" aria-hidden>{String(index + 1).padStart(2, "0")}</span>{t(topic)}</li>)}</ul>
      </div>
      <div className="mt-12 grid gap-3 border-t border-slate-200 pt-8 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <p className="eyebrow"><T>Your host</T></p>
        <div><h3 className="text-xl font-bold"><T>Ahmed Abdul Salam Hussein</T></h3><p className="mt-3 text-sm leading-7 text-graphite"><T>Founder of HELP Consulting, MBA graduate and current DBA researcher at the University of Dundee.</T></p></div>
      </div>
    </section>
    <section id="apply" className="scroll-mt-28 border-t border-slate-200 bg-white py-12 sm:py-16">
      <div className="section-shell grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div><p className="eyebrow"><T>Guest application</T></p><h2 className="mt-4 text-3xl font-bold"><T>Bring your experience to HELPCAST.</T></h2><p className="mt-5 text-sm leading-7 text-graphite"><T>For founders, executives, entrepreneurs and business leaders. Required fields are marked with an asterisk.</T></p></div>
        {state === "success" ? <div ref={success} tabIndex={-1} role="status" className="border-s-2 border-royal bg-skyline p-6 outline-none sm:p-8"><CheckCircle2 size={28} className="text-royal" aria-hidden /><h3 className="mt-4 text-xl font-bold"><T>Your application has been submitted successfully!</T></h3><p className="mt-4 leading-8 text-graphite"><T>Thank you for your interest in HELPCAST. Our team will review the applications and contact selected guests.</T></p></div> :
          <form ref={form} onSubmit={submit} noValidate aria-busy={state === "submitting"}>
            <fieldset disabled={state === "submitting"} className="min-w-0 border-0 p-0">
              <legend className="sr-only"><T>Guest application</T></legend>
              <div className="grid gap-5 sm:grid-cols-2">
                {textField("full_name", "Your full name", "name")}
                {textField("company_name", "Your company or project", "organization")}
                {textField("position", "Your role", "organization-title")}
                <div className="grid content-start gap-2"><label htmlFor="industry" className="text-sm font-semibold">{t(labels.industry)} <span aria-hidden>*</span></label>
                  <select {...attributes("industry")} className="field w-full" value={values.industry} onChange={e => change("industry", e.target.value)}><option value="">{t("Choose an industry")}</option>{sectors.map(([value, label]) => <option key={value} value={value}>{t(label)}</option>)}</select>{errorFor("industry")}</div>
                {textField("phone", "+964 770 000 0000", "tel")}
                {textField("email", "name@example.com", "email")}
                <div className="grid gap-2 sm:col-span-2"><label htmlFor="introduction" className="text-sm font-semibold">{t(labels.introduction)} <span aria-hidden>*</span></label><textarea {...attributes("introduction")} className="field min-h-36 w-full resize-y" dir="auto" rows={5} maxLength={4000} value={values.introduction} placeholder={t("Two to four sentences about your business and experience.")} onChange={e => change("introduction", e.target.value)} />{errorFor("introduction")}</div>
              </div>
              <div hidden aria-hidden><label htmlFor="website">Website</label><input name="website" id="website" tabIndex={-1} autoComplete="off" /></div>
              <div className="mt-6"><label className="flex cursor-pointer items-start gap-3 text-sm leading-7"><input name="consent" type="checkbox" required checked={values.consent} onChange={e => change("consent", e.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} className="mt-1.5 h-5 w-5 shrink-0 accent-royal" /><span><T>I agree to the use of my information to contact me about my guest application in accordance with the privacy policy.</T></span></label>{errorFor("consent")}
                <Link href="/helpcast/privacy" target="_blank" className="mt-2 inline-flex items-center gap-1 text-sm text-royal underline underline-offset-4"><T>Privacy policy</T><ArrowUpRight size={14} aria-hidden /></Link></div>
              <button className="btn-primary mt-7 w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto" type="submit">{state === "submitting" && <LoaderCircle size={17} className="animate-spin" aria-hidden />}{t(state === "submitting" ? "Submitting…" : "Submit Guest Application")}</button>
            </fieldset>
            {failure && <p role="alert" className="mt-5 text-sm leading-7 text-red-700">{t(failure)}</p>}
          </form>}
      </div>
    </section>
  </div>;
}
