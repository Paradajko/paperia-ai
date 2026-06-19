import { createHmac, timingSafeEqual } from 'node:crypto';

const MAX_LIFETIME_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function signature(email: string, expiration: number, secret: string): Buffer {
  return createHmac('sha256', secret)
    .update(`${normalizeEmail(email)}.${expiration}`)
    .digest();
}

export function createUnsubscribeToken(
  email: string,
  secret: string,
  now = new Date(),
  lifetimeDays = MAX_LIFETIME_DAYS,
): string {
  if (!secret || lifetimeDays <= 0 || lifetimeDays > MAX_LIFETIME_DAYS) {
    throw new Error('Invalid unsubscribe token configuration');
  }

  const expiration = Math.floor(
    (now.getTime() + lifetimeDays * DAY_MS) / 1000,
  );
  const encodedExpiration = Buffer.from(String(expiration)).toString('base64url');
  const encodedSignature = signature(email, expiration, secret).toString(
    'base64url',
  );
  return `${encodedExpiration}.${encodedSignature}`;
}

export function verifyUnsubscribeToken(
  email: string,
  token: string,
  secret: string,
  now = new Date(),
): boolean {
  try {
    const [encodedExpiration, encodedSignature, extra] = token.split('.');
    if (!encodedExpiration || !encodedSignature || extra || !secret) {
      return false;
    }

    const expiration = Number(
      Buffer.from(encodedExpiration, 'base64url').toString('utf8'),
    );
    const nowSeconds = Math.floor(now.getTime() / 1000);
    const maxExpiration = Math.floor(
      (now.getTime() + MAX_LIFETIME_DAYS * DAY_MS) / 1000,
    );
    if (
      !Number.isSafeInteger(expiration) ||
      expiration < nowSeconds ||
      expiration > maxExpiration
    ) {
      return false;
    }

    const actual = Buffer.from(encodedSignature, 'base64url');
    const expected = signature(email, expiration, secret);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function buildUnsubscribeUrl(
  email: string,
  secret: string,
  now = new Date(),
): string {
  const token = createUnsubscribeToken(email, secret, now);
  return `https://riadence.com/api/unsubscribe?token=${encodeURIComponent(token)}&email=${encodeURIComponent(normalizeEmail(email))}`;
}
