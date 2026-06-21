# Riadence IndexNow Design

## Context

IndexNow notifies participating search engines when the English, Slovak,
Serbian, or Ukrainian landing page changes. A single submission reaches the
IndexNow network used by Bing and Yandex and may be consumed by other
participating engines. Google does not support IndexNow and still relies on
normal crawling and sitemap discovery.

The IndexNow key is a public verification token, not a secret. Committing it is
required so crawlers can validate that riadence.com controls the submitted URL.

## Files

- `public/indexnow-key.txt` stores the canonical 32-character lowercase hex key.
- `public/<key>.txt` exposes the exact URL declared by `keyLocation`.
- `scripts/ensure-indexnow-key.mjs` creates the key and protocol alias
  idempotently.
- `scripts/submit-indexnow.mjs` submits the four localized landing URLs.
- `tests/indexnow.test.mjs` validates key format and the public alias.
- `tests/indexnow-submit.test.mjs` validates payloads, overrides, and failures.

## Usage

Ensure the verification files exist:

```bash
npm run indexnow:key
```

Submit all landing pages:

```bash
npm run indexnow
```

Submit one URL:

```bash
npm run indexnow:url https://riadence.com/sk/
```

Submit multiple selected URLs as one comma-separated argument:

```bash
npm run indexnow:url "https://riadence.com/sk/,https://riadence.com/ua/"
```

## Response Codes

- `200`: URLs accepted.
- `202`: request accepted; key validation may still be pending.
- `400`: malformed request.
- `403`: key or key location could not be validated.
- `422`: submitted URLs do not belong to the declared host or are invalid.
- `429`: rate limit exceeded; retry later.

The CLI exits successfully only for `200` and `202`. Other statuses print the
response body and set exit code `1`. Before deployment, `403` is expected
because the public key location is not yet available on riadence.com.
