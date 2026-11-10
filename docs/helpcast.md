# HELPCAST: email-only guest applications

The page is `/helpcast`, with a direct form link at `/helpcast#apply`. Arabic is
the default. AR | EN switches preserve form contents without a reload. The approved
logo is `public/helpcast-logo.png`.

## Delivery and privacy

Applications are sent directly over authenticated TLS SMTP to
`info@consultations.help`, from the same Namecheap mailbox. Both languages use
the same endpoint and inbox. All free-text values are included exactly as entered
in a plain-text email. Optional applicant email becomes Reply-To, never From/To.

There is **no application database, filesystem archive, queue, admin application
listing or separate website copy**. Neon is not needed. Mailbox/provider storage
and mail-server processing still apply. Successful HTTP responses mean the SMTP
server accepted the message for the recipient, not proof of final inbox delivery.
If SMTP fails, show an error and preserve the form on screen for a manual retry.
There is deliberately no stored background retry queue.

## Required private configuration

Set these server-only variables in Vercel Production (and Preview if testing there):

- `HELPCAST_SMTP_PASSWORD`: the existing password/application password for
  `info@consultations.help`, entered directly by the owner. Never paste into chat,
  source code, browser-public config, or GitHub.
- `HELPCAST_RATE_LIMIT_SECRET`: at least 32 randomly generated characters.

SMTP host is fixed to `mail.privateemail.com`, port 465 with TLS and certificate
verification. Outgoing mail authenticates as the info mailbox. No new email
service, sender domain or database subscription is required.

Before publishing, send a clearly labeled test using synthetic applicant details
and confirm arrival in the actual HELP inbox. Never report email delivery verified
from a mocked test alone. Check Spam/Junk as well. No secrets appear in client JS.

## Spam and duplicates

- Server/client validation, bounded JSON body, same-origin requests, hidden honeypot.
- No public GET endpoint; applicant bodies and SMTP errors are not logged.
- Five valid attempts per hour per HMAC network identifier per warm server instance.
  Only temporary digests/counters are held in RAM, not application fields or raw IPs.
  Vercel's overwritten network header is trusted only on Vercel; local development
  uses a single conservative bucket.
- Pending sends are coalesced by UUID; successful-send digests expire after 10 minutes.
  In-memory entries are capped and do not survive restarts or span multiple instances.
  A stable Message-ID assists tracking but SMTP does not guarantee exactly-once
  delivery after an ambiguous timeout or cold start. Do not claim global deduplication.
- Configure Vercel firewall rate limits for distributed production protection.
  Do not add persistent application storage to solve this without owner approval.

## Validation

`npm test`: exact email content, fixed recipient, rejected SMTP, temporary rate
limits, concurrent retries, validation, origin checks and missing configuration.
Email transport is mocked for automated tests; the real inbox smoke test is separate.
`npm run lint`, `npm run build`, `npm run test:browser`: bilingual desktop/mobile,
input preservation, feedback, privacy and existing-route regression checks.
