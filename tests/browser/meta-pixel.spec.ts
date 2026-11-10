import { expect, test, Page } from "@playwright/test";

const id = "helpcast_719ba8fc-56d2-4ead-b9b7-f0e6b7bc3641";
const pixel = "1662775865232422";
async function events(page: Page) {
  return page.evaluate(() => (window as unknown as { pixelCalls: unknown[][] }).pixelCalls ?? []);
}
async function setup(page: Page) {
  // A local fake Pixel only: no applicant or test event is sent to Meta.
  await page.route("https://www.facebook.com/**", route => route.abort());
  await page.route("https://connect.facebook.net/**", route => route.fulfill({ contentType: "application/javascript", body: `
    window.pixelCalls = window.pixelCalls || [];
    var f = window.fbq;
    f.callMethod = function() { window.pixelCalls.push(Array.from(arguments)); };
    f.queue.splice(0).forEach(function(args) { f.callMethod.apply(f, args); });
  ` }));
  await page.goto("/helpcast");
}
async function fill(page: Page) {
  await page.locator("#full_name").fill("Test Applicant");
  await page.locator("#company_name").fill("Test Company");
  await page.locator("#position").fill("Founder");
  await page.locator("#industry").selectOption("technology");
  await page.locator("#phone").fill("+9647700000000");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#introduction").fill("Private application answers must not reach Meta.");
  await page.locator("input[name=consent]").check();
}
const submit = (page: Page) => page.getByRole("button", { name: "إرسال طلب الاستضافة", exact: true }).click();

test("consent, PageView, success-only Lead, retries and session deduplication", async ({ page }) => {
  await setup(page);
  expect(await page.locator('script[src*="fbevents.js"]').count()).toBe(0);
  await page.getByRole("button", { name: "قبول التتبّع التسويقي", exact: true }).click();
  await expect.poll(async () => (await events(page)).filter(e => e[2] === "PageView").length).toBe(1);
  expect((await events(page)).filter(e => e[0] === "init")).toEqual([["init", pixel]]);
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.getByRole("button", { name: "Submit Guest Application", exact: true }).click();
  expect((await events(page)).filter(e => e[2] === "Lead")).toEqual([]);
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await fill(page);
  await page.route("**/api/helpcast", route => route.fulfill({ status: 422, json: { code: "validation" } }));
  await submit(page);
  await expect(page.getByRole("main").getByRole("alert")).toBeVisible();
  expect((await events(page)).filter(e => e[2] === "Lead")).toEqual([]);
  await page.unroute("**/api/helpcast");
  await page.route("**/api/helpcast", route => route.fulfill({ status: 503, json: { code: "unavailable" } }));
  await submit(page);
  await expect(page.getByRole("main").getByRole("alert")).toContainText("تعذّر");
  expect((await events(page)).filter(e => e[2] === "Lead")).toEqual([]);
  await page.unroute("**/api/helpcast");
  let finish!: () => void;
  const gate = new Promise<void>(resolve => { finish = resolve; });
  await page.route("**/api/helpcast", async route => { await gate; await route.fulfill({ status: 201, json: { ok: true, event_id: id } }); });
  await submit(page);
  await expect(page.locator("form")).toHaveAttribute("aria-busy", "true");
  expect((await events(page)).filter(e => e[2] === "Lead")).toEqual([]);
  finish();
  await expect(page.getByRole("status")).toBeVisible();
  await expect.poll(async () => (await events(page)).filter(e => e[2] === "Lead")).toEqual([["trackSingle", pixel, "Lead", {}, { eventID: id }]]);
  expect(JSON.stringify(await events(page))).not.toMatch(/Test Applicant|Test Company|test@example|964770|Private application/);
  // Reload and replay the backend's duplicate success: session event ID suppresses a second Lead.
  await page.reload();
  await expect.poll(async () => (await events(page)).filter(e => e[2] === "PageView").length).toBe(1);
  await fill(page);
  await submit(page);
  await expect(page.getByRole("status")).toBeVisible();
  expect((await events(page)).filter(e => e[2] === "Lead")).toEqual([]);
});

test("rejection and withdrawal block conversions without blocking applications", async ({ page }) => {
  await setup(page);
  await page.getByRole("button", { name: "رفض التتبّع التسويقي", exact: true }).click();
  await fill(page);
  await page.route("**/api/helpcast", route => route.fulfill({ status: 201, json: { ok: true, event_id: id } }));
  await submit(page);
  await expect(page.getByRole("status")).toBeVisible();
  expect(await events(page)).toEqual([]);
  expect(await page.locator('script[src*="fbevents.js"]').count()).toBe(0);
  await page.getByRole("button", { name: "تفضيلات ملفات الارتباط", exact: true }).click();
  await page.getByRole("button", { name: "قبول التتبّع التسويقي", exact: true }).click();
  await expect.poll(async () => (await events(page)).filter(e => e[2] === "PageView").length).toBe(1);
  expect((await events(page)).filter(e => e[2] === "Lead")).toEqual([]);
  await page.getByRole("button", { name: "تفضيلات ملفات الارتباط", exact: true }).click();
  await page.getByRole("button", { name: "رفض التتبّع التسويقي", exact: true }).click();
  expect((await events(page)).at(-1)).toEqual(["consent", "revoke"]);
  await page.reload();
  await fill(page);
  await submit(page);
  await expect(page.getByRole("status")).toBeVisible();
  expect(await events(page)).toEqual([]);
});

test("one PageView per route, not per language or hash change", async ({ page }) => {
  await setup(page);
  await page.getByRole("button", { name: "قبول التتبّع التسويقي", exact: true }).click();
  await expect.poll(async () => (await events(page)).filter(e => e[2] === "PageView").length).toBe(1);
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.getByRole("link", { name: "Apply to be a guest", exact: true }).click();
  expect((await events(page)).filter(e => e[2] === "PageView")).toHaveLength(1);
  await page.getByRole("link", { name: "Privacy policy", exact: true }).evaluate((link: HTMLAnchorElement) => link.removeAttribute("target"));
  await page.getByRole("link", { name: "Privacy policy", exact: true }).click();
  await expect.poll(async () => (await events(page)).filter(e => e[2] === "PageView").length).toBe(2);
  expect((await events(page)).filter(e => e[0] === "init")).toHaveLength(1);
});

test("withdrawal before the script loads discards queued conversions", async ({ page }) => {
  await setup(page);
  await page.unroute("https://connect.facebook.net/**");
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route("https://connect.facebook.net/**", async route => {
    await gate;
    await route.fulfill({ contentType: "application/javascript", body: `
      window.pixelCalls = [];
      var f = window.fbq;
      f.callMethod = function() { window.pixelCalls.push(Array.from(arguments)); };
      f.queue.splice(0).forEach(function(args) { f.callMethod.apply(f, args); });
    ` });
  });
  await page.getByRole("button", { name: "قبول التتبّع التسويقي", exact: true }).click();
  await fill(page);
  await page.route("**/api/helpcast", route => route.fulfill({ status: 201, json: { ok: true, event_id: id } }));
  await submit(page);
  await expect(page.getByRole("status")).toBeVisible();
  await page.getByRole("button", { name: "تفضيلات ملفات الارتباط", exact: true }).click();
  await page.getByRole("button", { name: "رفض التتبّع التسويقي", exact: true }).click();
  release();
  await expect.poll(async () => (await events(page)).length).toBeGreaterThan(0);
  expect((await events(page)).filter(e => e[0] === "trackSingle")).toEqual([]);
});

test("Global Privacy Control overrides a previously accepted preference", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true });
    localStorage.setItem("help-marketing-consent-v1", "accepted");
  });
  await setup(page);
  await page.getByRole("button", { name: "تفضيلات ملفات الارتباط", exact: true }).click();
  await expect(page.getByText("نحترم إشارة الخصوصية من متصفحك. التتبّع التسويقي معطّل.")).toBeVisible();
  await expect(page.getByRole("button", { name: "قبول التتبّع التسويقي", exact: true })).toHaveCount(0);
  expect(await page.locator('script[src*="fbevents.js"]').count()).toBe(0);
});

for (const width of [320, 390, 1440]) {
  test(`Arabic and English consent banner fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await setup(page);
    const banner = page.getByRole("region", { name: "ملفات الارتباط التسويقية" });
    await expect(banner).toBeVisible();
    await expect(banner).toHaveAttribute("dir", "rtl");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `outputs/meta-consent-${width}-ar.png` });
    await page.getByRole("button", { name: "English", exact: true }).click();
    await expect(page.getByRole("region", { name: "Marketing cookies" })).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("button", { name: "Accept marketing", exact: true })).toBeInViewport();
    await expect(page.getByRole("button", { name: "Reject marketing", exact: true })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `outputs/meta-consent-${width}-en.png` });
  });
}
