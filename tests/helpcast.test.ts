import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import { NextRequest } from "next/server";
import { ApplicationValues, validateApplication } from "../lib/helpcast-validation";
import { applicationEmail, sendApplicationEmail, HELPCAST_MAILBOX } from "../lib/helpcast-mail";
import { allowAttempt, deliverOnce } from "../lib/helpcast-guards";
import { POST } from "../app/api/helpcast/route";

const application: ApplicationValues = {
  full_name: "  أحمد حسين  ", company_name: "شركة النمو", position: "Founder", industry: "technology",
  phone: "+964 780 245 4247", email: "", introduction: "تجربة عراقية.\nBuilding a company, one step at a time.", consent: true
};

test("validates both languages, optional email, phone formats and field limits", () => {
  assert.deepEqual(validateApplication(application), {});
  assert.deepEqual(validateApplication({ ...application, phone: "٠٧٨٠٢٤٥٤٢٤٧" }), {});
  assert.deepEqual(validateApplication({ ...application, phone: "+44 7700 900123" }), {});
  for (const [key, value] of [["full_name", " "], ["company_name", 123], ["position", "x".repeat(201)], ["phone", "hello"], ["phone", "+0001234567"], ["email", "bad@"], ["industry", "invented"], ["introduction", "x".repeat(4001)], ["consent", false]]) {
    assert.ok(validateApplication({ ...application, [key as string]: value })[key as keyof ApplicationValues], String(key));
  }
});

test("sends exact text to fixed HELP inbox and requires SMTP recipient acceptance", async () => {
  const id = randomUUID();
  for (const language of ["ar", "en"] as const) {
    const message = applicationEmail(application, id, language);
    assert.equal(message.to, HELPCAST_MAILBOX);
    assert.equal(message.from.address, HELPCAST_MAILBOX);
    assert.ok(message.text.includes(application.full_name));
    assert.ok(message.text.includes(application.introduction));
    assert.equal(message.messageId, `<helpcast-${id}@consultations.help>`);
    let sent = false;
    await sendApplicationEmail(application, id, language, { sendMail: async m => { sent = true; assert.equal(m.to, HELPCAST_MAILBOX); return { accepted: [HELPCAST_MAILBOX] }; } });
    assert.equal(sent, true);
  }
  await assert.rejects(() => sendApplicationEmail(application, id, "ar", { sendMail: async () => ({ accepted: [] }) }));
  await assert.rejects(() => sendApplicationEmail(application, id, "ar", { sendMail: async () => { throw new Error("SMTP offline"); } }));
});

test("temporary counters and idempotency prevent repeated sends without storing applications", async () => {
  process.env.HELPCAST_RATE_LIMIT_SECRET = "test-only-".repeat(8);
  const ip = randomUUID();
  for (let i = 0; i < 5; i++) assert.equal(allowAttempt(ip), true);
  assert.equal(allowAttempt(ip), false);
  const id = randomUUID();
  let count = 0;
  const send = async () => { count++; };
  const results = await Promise.all([deliverOnce(id, "digest-only", send), deliverOnce(id, "digest-only", send)]);
  assert.deepEqual(results, ["sent", "duplicate"]);
  assert.equal(await deliverOnce(id, "different-digest", send), "conflict");
  assert.equal(await deliverOnce(id, "digest-only", send), "duplicate");
  assert.equal(count, 1);
  const retry = randomUUID();
  await assert.rejects(() => deliverOnce(retry, "digest", async () => { throw new Error("failed"); }));
  assert.equal(await deliverOnce(retry, "digest", send), "sent");
});

test("endpoint rejects unsafe requests and never reports success without SMTP configuration", async () => {
  const send = (data: unknown, origin = "http://localhost:3100") => POST(new NextRequest("http://localhost:3100/api/helpcast", { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(data) }));
  assert.equal((await send(application, "https://elsewhere.example")).status, 403);
  assert.equal((await send({})).status, 422);
  assert.equal((await send({ ...application, website: "spam" })).status, 400);
  assert.equal((await send({ ...application, introduction: "x".repeat(25000) })).status, 413);
  const old = process.env.HELPCAST_SMTP_PASSWORD;
  delete process.env.HELPCAST_SMTP_PASSWORD;
  try { assert.equal((await send({ ...application, submission_id: randomUUID(), language: "ar" })).status, 503); }
  finally { if (old) process.env.HELPCAST_SMTP_PASSWORD = old; }
});

test("success and duplicate responses share an opaque event ID, failures have none", async (context) => {
  const password = process.env.HELPCAST_SMTP_PASSWORD;
  const secret = process.env.HELPCAST_RATE_LIMIT_SECRET;
  process.env.HELPCAST_SMTP_PASSWORD = "test-only-not-a-real-password";
  process.env.HELPCAST_RATE_LIMIT_SECRET = "test-only-secret".repeat(4);
  let deliveries = 0;
  let fail = false;
  context.mock.method(nodemailer, "createTransport", () => ({ sendMail: async () => {
    deliveries++;
    if (fail) throw new Error("test transport unavailable");
    return { accepted: [HELPCAST_MAILBOX] };
  } }));
  context.mock.method(console, "error", () => {});
  const id = randomUUID();
  const send = (data: object) => POST(new NextRequest("http://localhost:3100/api/helpcast", { method: "POST", headers: { origin: "http://localhost:3100", "content-type": "application/json" }, body: JSON.stringify({ ...application, submission_id: id, language: "ar", ...data }) }));
  try {
    const first = await send({});
    assert.equal(first.status, 201);
    const result = await first.json();
    assert.deepEqual(result, { ok: true, event_id: `helpcast_${id}` });
    const duplicate = await send({});
    assert.equal(duplicate.status, 200);
    assert.deepEqual(await duplicate.json(), result);
    assert.equal(deliveries, 1);
    const conflict = await send({ full_name: "Changed name" });
    assert.equal(conflict.status, 409);
    assert.equal((await conflict.json()).event_id, undefined);
    const invalid = await send({ phone: "invalid" });
    assert.equal(invalid.status, 422);
    assert.equal((await invalid.json()).event_id, undefined);
    fail = true;
    const failure = await send({ submission_id: randomUUID() });
    assert.equal(failure.status, 503);
    assert.equal((await failure.json()).event_id, undefined);
  } finally {
    if (password === undefined) delete process.env.HELPCAST_SMTP_PASSWORD; else process.env.HELPCAST_SMTP_PASSWORD = password;
    if (secret === undefined) delete process.env.HELPCAST_RATE_LIMIT_SECRET; else process.env.HELPCAST_RATE_LIMIT_SECRET = secret;
    context.mock.restoreAll();
  }
});
