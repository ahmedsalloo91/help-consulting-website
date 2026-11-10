// Only opaque submission IDs enter this module; never pass application fields.
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
export const MARKETING_CONSENT_KEY = "help-marketing-consent-v1";
export type MarketingConsent = "accepted" | "rejected";
type Pixel = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; push?: Pixel; loaded?: boolean; version?: string };
declare global {
  interface Window { fbq?: Pixel; _fbq?: Pixel; }
}

let consent = false;
let ready = false;
let initialized = false;
let lastPage: string | null = null;
let waiting: (() => void)[] = [];
const leads = new Set<string>();

export function validPixelId() { return /^\d{10,20}$/.test(META_PIXEL_ID); }
export function privacySignal() {
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function setMarketingConsent(allowed: boolean) {
  consent = allowed && !privacySignal() && validPixelId();
  if (!consent) {
    waiting = [];
    lastPage = null;
    window.fbq?.("consent", "revoke");
    // Delete Meta's first-party cookies on this host and parent domains.
    const parts = location.hostname.split(".");
    for (const name of ["_fbp", "_fbc"]) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      for (let i = 0; i < parts.length - 1; i++) {
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${parts.slice(i).join(".")}; SameSite=Lax`;
      }
    }
    return;
  }
  if (!window.fbq) {
    const pixel: Pixel = function (...args: unknown[]) {
      if (pixel.callMethod) pixel.callMethod(...args);
      else pixel.queue.push(args);
    } as Pixel;
    pixel.queue = []; pixel.push = pixel; pixel.loaded = true; pixel.version = "2.0";
    window.fbq = pixel;
    window._fbq ??= pixel;
  }
  window.fbq("consent", "grant");
  if (!initialized) {
    window.fbq("set", "autoConfig", false, META_PIXEL_ID);
    window.fbq("init", META_PIXEL_ID);
    initialized = true;
  }
}

export function pixelReady() {
  ready = true;
  if (!consent) { window.fbq?.("consent", "revoke"); return; }
  const events = waiting; waiting = [];
  events.forEach(send => send());
}

function send(event: "PageView" | "Lead", eventId?: string) {
  if (!consent || privacySignal()) return;
  const dispatch = () => {
    if (!consent || privacySignal()) return;
    try {
      if (eventId) window.fbq?.("trackSingle", META_PIXEL_ID, event, {}, { eventID: eventId });
      else window.fbq?.("trackSingle", META_PIXEL_ID, event);
    } catch { /* Tracking must never interrupt an application. */ }
  };
  if (ready) dispatch(); else waiting.push(dispatch);
}

export function trackPageView(pathname: string) {
  if (!consent || lastPage === pathname) return;
  lastPage = pathname;
  send("PageView");
}

export function trackHelpcastLead(eventId: unknown) {
  if (!consent || privacySignal() || typeof eventId !== "string" || !/^helpcast_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId)) return;
  const key = `help-meta-lead:${eventId}`;
  try { if (sessionStorage.getItem(key)) return; } catch { /* Memory fallback for restricted storage. */ }
  if (leads.has(eventId)) return;
  leads.add(eventId);
  try { sessionStorage.setItem(key, "1"); } catch { /* Memory fallback. */ }
  send("Lead", eventId);
}
