import { createHmac } from "node:crypto";

// Short-lived digests/counters only. Applicant fields are never persisted here.
const attempts = new Map<string, { count: number; until: number }>();
const delivered = new Map<string, { digest: string; until: number }>();
const inFlight = new Map<string, { digest: string; promise: Promise<void> }>();
const MAX_ENTRIES = 1000;
function prune<T extends { until: number }>(map: Map<string, T>, now: number) {
  map.forEach((value, key) => { if (value.until <= now) map.delete(key); });
  while (map.size >= MAX_ENTRIES) map.delete(map.keys().next().value!);
}
export function privateDigest(value: string) {
  return createHmac("sha256", process.env.HELPCAST_RATE_LIMIT_SECRET!).update(value).digest("hex");
}
export function allowAttempt(ip: string, now = Date.now()) {
  prune(attempts, now);
  const key = privateDigest(ip);
  const bucket = attempts.get(key) ?? { count: 0, until: now + 3600000 };
  bucket.count++;
  attempts.set(key, bucket);
  return bucket.count <= 5;
}
export async function deliverOnce(id: string, digest: string, send: () => Promise<void>) {
  const now = Date.now();
  prune(delivered, now);
  const known = delivered.get(id) ?? inFlight.get(id);
  if (known && known.digest !== digest) return "conflict" as const;
  if (delivered.has(id)) return "duplicate" as const;
  const pending = inFlight.get(id);
  if (pending) { await pending.promise; return "duplicate" as const; }
  if (inFlight.size >= 20) return "busy" as const;
  const promise = Promise.resolve().then(send);
  inFlight.set(id, { digest, promise });
  try {
    await promise;
    delivered.set(id, { digest, until: Date.now() + 600000 });
    return "sent" as const;
  } finally { inFlight.delete(id); }
}
