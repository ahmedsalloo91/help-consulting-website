import { NextRequest, NextResponse } from "next/server";
import { helpcastMailConfigured, sendApplicationEmail } from "@/lib/helpcast-mail";
import { allowAttempt, deliverOnce, privateDigest } from "@/lib/helpcast-guards";
import { ApplicationValues, validateApplication } from "@/lib/helpcast-validation";

export const runtime = "nodejs";
const reply = (body: object, status: number) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin !== request.nextUrl.origin) return reply({ code: "invalid" }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ code: "invalid" }, 415);
  // Bound the actual stream, rather than trusting Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return reply({ code: "invalid" }, 400);
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > 24000) { await reader.cancel(); return reply({ code: "invalid" }, 413); }
    chunks.push(value);
  }
  let data;
  try { data = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return reply({ code: "invalid" }, 400); }
  if (!data || typeof data !== "object" || Array.isArray(data)) return reply({ code: "invalid" }, 400);
  if (data.website) return reply({ code: "invalid" }, 400);
  const errors = validateApplication(data);
  if (Object.keys(errors).length) return reply({ code: "validation", errors }, 422);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.submission_id ?? "") || !["ar", "en"].includes(data.language)) return reply({ code: "invalid" }, 400);
  if (!helpcastMailConfigured()) return reply({ code: "unavailable" }, 503);
  // Vercel overwrites this header. Do not trust arbitrary forwarded IPs off Vercel.
  const ip = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ?? "unknown" : "local";
  try {
    if (!allowAttempt(ip)) return NextResponse.json({ code: "limited" }, { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": "3600" } });
    const values: ApplicationValues = { full_name: data.full_name, company_name: data.company_name, position: data.position, industry: data.industry, phone: data.phone, email: data.email, introduction: data.introduction, consent: data.consent };
    const result = await deliverOnce(data.submission_id, privateDigest(JSON.stringify(values)), () => sendApplicationEmail(values, data.submission_id, data.language));
    if (result === "conflict") return reply({ code: "invalid" }, 409);
    if (result === "busy") return reply({ code: "unavailable" }, 503);
    // Stable across unchanged retries, only returned after SMTP accepts delivery.
    return reply({ ok: true, event_id: `helpcast_${data.submission_id}` }, result === "sent" ? 201 : 200);
  } catch {
    // Never log applicant fields, mail bodies, credentials or SMTP errors.
    console.error("HELPCAST email delivery failed");
    return reply({ code: "unavailable" }, 503);
  }
}
