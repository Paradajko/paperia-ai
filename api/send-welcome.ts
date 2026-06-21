import { Resend } from 'resend';

import { buildUnsubscribeUrl } from './emails/unsubscribe-token.js';
import {
  buildSequenceEmail,
  type SequenceEmail,
} from './emails/templates.js';

declare const process: {
  env: Record<string, string | undefined>;
};

type ServerlessRequest = {
  method?: string;
  body?: unknown;
};

type ServerlessResponse = {
  status(statusCode: number): ServerlessResponse;
  json(body: unknown): void;
};

type WelcomeRequest = {
  email: string;
  name?: string;
  nationality?: string;
  destinationCountry?: string;
  residenceType?: string;
  locale?: 'en' | 'sk' | 'rs' | 'ua';
};

type SendEmail = (
  email: SequenceEmail,
) => Promise<{ error: unknown | null }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionalString(
  body: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = body[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function parseWelcomeRequest(body: unknown): WelcomeRequest | null {
  if (!isRecord(body)) {
    return null;
  }
  const email = optionalString(body, 'email');
  return email
    ? {
        email,
        name: optionalString(body, 'name'),
        nationality: optionalString(body, 'nationality'),
        destinationCountry: optionalString(body, 'destinationCountry'),
        residenceType: optionalString(body, 'residenceType'),
        locale:
          body.locale === 'sk' || body.locale === 'rs' || body.locale === 'ua'
            ? body.locale
            : 'en',
      }
    : null;
}

export function createSendWelcomeHandler(
  sendEmail: SendEmail,
  unsubscribeSecret = 'development-only-secret',
) {
  return async function handler(
    req: ServerlessRequest,
    res: ServerlessResponse,
  ): Promise<void> {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const input = parseWelcomeRequest(req.body);
    if (!input) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    try {
      const email = buildSequenceEmail('welcome', {
        ...input,
        unsubscribeUrl: buildUnsubscribeUrl(
          input.email,
          unsubscribeSecret,
        ),
      });
      const { error } = await sendEmail(email);
      if (error) {
        throw error;
      }
      res.status(200).json({ ok: true });
    } catch (error: unknown) {
      console.error('Failed to send welcome email:', error);
      res.status(500).json({ error: 'Failed to send welcome email' });
    }
  };
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse,
): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'Email service is not configured' });
    return;
  }
  return createSendWelcomeHandler(
    (email) => resend.emails.send(email),
    secret,
  )(req, res);
}
