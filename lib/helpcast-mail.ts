import nodemailer from "nodemailer";
import { ApplicationValues, sectors } from "@/lib/helpcast-validation";

export const HELPCAST_MAILBOX = "info@consultations.help";

export function helpcastMailConfigured() {
  return Boolean(process.env.HELPCAST_SMTP_PASSWORD && (process.env.HELPCAST_RATE_LIMIT_SECRET?.length ?? 0) >= 32);
}

export function applicationEmail(values: ApplicationValues, submissionId: string, language: "ar" | "en") {
  const sector = sectors.find(([key]) => key === values.industry)?.[1] ?? values.industry;
  return {
    from: { name: "HELPCAST", address: HELPCAST_MAILBOX },
    to: HELPCAST_MAILBOX,
    ...(values.email.trim() ? { replyTo: values.email.trim() } : {}),
    subject: "HELPCAST | طلب استضافة جديد / New guest application",
    messageId: `<helpcast-${submissionId}@consultations.help>`,
    text: [
      "HELPCAST — طلب استضافة جديد / New guest application",
      `رقم الطلب / Reference: ${submissionId}`,
      `اللغة / Language: ${language}`,
      `التاريخ / Submitted: ${new Date().toISOString()}`,
      "", "الاسم الكامل / Full Name:", values.full_name,
      "", "الشركة أو المشروع / Company or Project:", values.company_name,
      "", "المنصب / Job Title:", values.position,
      "", "القطاع / Industry:", sector,
      "", "الهاتف / واتساب / Phone / WhatsApp:", values.phone,
      "", "البريد الإلكتروني / Email:", values.email,
      "", "عن الشركة والتجربة / Introduction:", values.introduction,
      "", "تمت الموافقة على سياسة الخصوصية / Privacy consent: accepted (2026-11-10)"
    ].join("\n"),
    disableFileAccess: true,
    disableUrlAccess: true
  };
}

interface MailSender {
  sendMail(message: ReturnType<typeof applicationEmail>): Promise<{ accepted?: unknown[] }>;
}

export async function sendApplicationEmail(values: ApplicationValues, submissionId: string, language: "ar" | "en", sender?: MailSender) {
  const transport = sender ?? nodemailer.createTransport({
    host: "mail.privateemail.com", port: 465, secure: true,
    auth: { user: HELPCAST_MAILBOX, pass: process.env.HELPCAST_SMTP_PASSWORD },
    connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000,
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    logger: false, debug: false
  });
  const result = await transport.sendMail(applicationEmail(values, submissionId, language));
  if (!result.accepted?.some(address => String(address).toLowerCase() === HELPCAST_MAILBOX)) {
    throw new Error("HELPCAST recipient was not accepted");
  }
}
