# HELPCAST Meta Pixel

## Configuration

- Existing dataset: **HELP Consulting | Website**, ID **1662775865232422**.
- Set `NEXT_PUBLIC_META_PIXEL_ID=1662775865232422` in `.env.local` for local development, or the intended Vercel environment **before building**. This is a public ID, not a secret. Restart/rebuild after changing it. Missing/invalid IDs disable the integration.
- There is one integration in the root layout, using `next/script`. Do not also install this Pixel in a tag manager, another component, or a Vercel integration.
- No CAPI is implemented and no access token is required. If CAPI is added later, use a server-only environment variable (never `NEXT_PUBLIC_*`) and the same `Lead` event name and backend `event_id` as the browser.
- In Events Manager, keep **automatic advanced matching** and **automatic events without code** disabled for this dataset. This implementation disables automatic configuration and supplies no matching data. Do not configure button-click or form-open Lead rules in Meta's Event Setup Tool.

## What Counts

Applications still go only to `info@consultations.help`, not to a database. The API returns success and an opaque `helpcast_<submission UUID>` event ID only after the existing SMTP provider accepts the message for the HELP inbox. This is not a guarantee of inbox delivery and does not introduce database storage.

The browser sends `Lead` only on that successful response, with `{eventID: event_id}` and an empty custom-parameter object. No applicant fields, contact details, sector, or free-text answers are passed to Meta. Do not put personal information in page URLs: the Pixel inherently receives page/browser context.

Unchanged retries share the existing submission ID and backend idempotency result. A memory guard plus `sessionStorage` suppress repeated Lead events with that ID, including reloads in the same tab. This is not durable cross-device deduplication; the existing server mail guard is also temporary and per warm instance. Ad blockers, declined consent, lost responses and closing the page before the script loads can prevent a browser conversion from reaching Meta.

## Consent

The bilingual banner offers equally styled Accept/Reject controls. No Meta script, beacon or PageView loads before explicit acceptance. Global Privacy Control disables marketing tracking. The form's required contact consent is independent; visitors can submit without marketing consent.

Acceptance enables one PageView for the current path and subsequent App Router path changes. Language, query and hash changes do not add PageViews. The footer's **Cookie preferences** allows withdrawal. Withdrawal sends consent revoke, clears pending events and Meta first-party cookies, and stops application events. It cannot undo information already sent to Meta. Preferences are stored in localStorage; blocked storage falls back to the current page. Cross-tab preference changes are respected. Submissions made without consent are not backfilled later.

## Test Events Checklist

Do not publish or change production environment settings until the owner approves. After approval, configure the public ID, deploy and perform a controlled test:

1. Open Meta **Events Manager**, select **HELP Consulting | Website (1662775865232422)**, then **Test Events**. In the browser events section, open `https://www.consultations.help/helpcast#apply` using Meta's website test option. Interface labels may vary. Use a browser without tracking blockers for this verification.
2. In a fresh browser session, confirm no Pixel requests before consent. Reject marketing and verify that a valid application can still succeed without PageView/Lead. A real successful application sends an email to HELP; use clearly marked test details, not another person's information.
3. Reopen Cookie preferences and accept. Expect one **PageView** with the correct dataset. Navigate to another page: one more PageView. Change AR/EN or `#apply`: no extra PageView.
4. Submit an empty/invalid application. Expect validation feedback and **no Lead**. A failed API/SMTP response must also produce no Lead.
5. Submit a valid, clearly marked test application. Only after the success message should one browser **Lead** appear. Inspect its Event ID: `helpcast_<UUID>`. There should be no applicant values in custom parameters. Confirm the HELP inbox received the test application separately.
6. Check browser Network requests to `facebook.com/tr`: `id=1662775865232422`, `ev=PageView` or `ev=Lead`; Lead includes its event ID. A single form success should not show duplicate Lead requests. Automated tests below cover duplicate API responses without sending duplicate real emails.
7. Withdraw via Cookie preferences. Subsequent route changes and submissions must not send events. Reload and confirm rejection persists. Test both Arabic/RTL and English/LTR on mobile and desktop.

Browser-only Test Events does not require a CAPI `test_event_code`. This repository has not been verified in the real Meta account or deployed as part of this change.

## Local Checks

```sh
npm test
npm run lint
NEXT_PUBLIC_META_PIXEL_ID=1662775865232422 npm run build
npm run test:browser
```

Use Node 22 (the project engine). Playwright uses the production build on port 3100 and fails if the port is occupied. Build with the public ID above before running browser tracking tests. Tests replace the Meta script with a local fake and mock SMTP/API successes; they send no real messages or Meta events. Coverage includes invalid submissions, SMTP failure, success, duplicate responses, consent refusal/withdrawal, route navigation and bilingual mobile layout.

References: [Meta conversion tracking](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking/), [Meta consent guidance](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/), [Meta Pixel and CAPI deduplication](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/).
