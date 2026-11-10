import { test, expect } from "@playwright/test";

for (const width of [320, 390, 1440]) {
  test(`bilingual form, preserved input and feedback at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/helpcast");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("قصتك تستحق أن تُروى");
    await expect(page.getByRole("button", { name: "العربية", exact: true })).toBeVisible();
    await expect(page.getByRole("img", { name: "HELPCAST", exact: true })).toBeVisible();
    expect(await page.getByRole("img", { name: "HELPCAST", exact: true }).evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await page.screenshot({ path: `outputs/helpcast-${width}-ar-form.png`, fullPage: true });
    await page.locator("#full_name").fill("  أحمد Hussein  ");
    await page.locator("#company_name").fill("شركة التجربة");
    await page.getByRole("button", { name: "English", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("#full_name")).toHaveValue("  أحمد Hussein  ");
    await page.getByRole("button", { name: "Submit Guest Application", exact: true }).click();
    await expect(page.getByText("Please choose an industry.", { exact: true })).toBeVisible();
    await page.locator("#position").fill("Founder");
    await page.locator("#industry").selectOption("technology");
    await page.locator("#phone").fill("٠٧٨٠٢٤٥٤٢٤٧");
    await page.locator("#introduction").fill("تجربتنا في الأعمال. Our company story.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "العربية", exact: true }).click();
    await expect(page.locator("#industry")).toHaveValue("technology");
    await expect(page.getByRole("checkbox")).toBeChecked();
    await expect(page.locator("#industry option:checked")).toHaveText("التكنولوجيا");
    await page.route("**/api/helpcast", route => route.fulfill({ status: 503, json: { code: "unavailable" } }));
    await page.getByRole("button", { name: "إرسال طلب الاستضافة", exact: true }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText("تعذّر إرسال طلبك");
    await expect(page.locator("#full_name")).toHaveValue("  أحمد Hussein  ");
    await page.getByRole("button", { name: "English", exact: true }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText("We could not submit your application.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `outputs/helpcast-${width}-en.png`, fullPage: true });
    await page.unroute("**/api/helpcast");
    await page.route("**/api/helpcast", async route => {
      const body = route.request().postDataJSON();
      expect(body.full_name).toBe("  أحمد Hussein  ");
      expect(body.phone).toBe("٠٧٨٠٢٤٥٤٢٤٧");
      expect(body.language).toBe("ar");
      await route.fulfill({ status: 201, json: { ok: true } });
    });
    await page.getByRole("button", { name: "العربية", exact: true }).click();
    await page.getByRole("button", { name: "إرسال طلب الاستضافة", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("تم استلام طلبك بنجاح!");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `outputs/helpcast-${width}-ar.png`, fullPage: true });
    await page.getByRole("button", { name: "English", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("Your application has been submitted successfully!");
  });
}

test("privacy and public API safety", async ({ page, request }) => {
  await page.goto("/helpcast/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("خصوصية طلبات HELPCAST");
  expect((await request.get("/api/helpcast")).status()).toBe(405);
  for (const route of ["/", "/about", "/services", "/industries", "/case-studies", "/team", "/contact"]) {
    expect((await request.get(route)).status()).toBe(200);
  }
});
