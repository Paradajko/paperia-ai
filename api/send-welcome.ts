import { Resend } from 'resend';

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
};

type WelcomeEmail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
};

type SendEmail = (
  email: WelcomeEmail,
) => Promise<{ error: unknown | null }>;

const DISCLAIMER =
  'I am not a lawyer. This is general information, not legal advice.';

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
  if (!email) {
    return null;
  }

  return {
    email,
    name: optionalString(body, 'name'),
    nationality: optionalString(body, 'nationality'),
    destinationCountry: optionalString(body, 'destinationCountry'),
    residenceType: optionalString(body, 'residenceType'),
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildWelcomeEmail(input: WelcomeRequest): WelcomeEmail {
  const greeting = input.name ?? 'there';
  const details = [
    input.nationality ? `Nationality: ${input.nationality}` : null,
    input.destinationCountry
      ? `Destination country: ${input.destinationCountry}`
      : null,
    input.residenceType ? `Residence type: ${input.residenceType}` : null,
  ].filter((detail): detail is string => detail !== null);
  const textDetails = details.length
    ? `\n\nHere is what we have so far:\n- ${details.join('\n- ')}`
    : '';
  const htmlDetails = details.length
    ? `<p>Here is what we have so far:</p><ul>${details
        .map((detail) => `<li>${escapeHtml(detail)}</li>`)
        .join('')}</ul>`
    : '';

  return {
    from: 'Paperia <onboarding@resend.dev>',
    to: input.email,
    replyTo: 'hello@paperia.ai',
    subject: 'Welcome to Paperia — your residence checklist is on its way',
    text: `Hi ${greeting},

Welcome to Paperia. We are preparing a practical residence permit checklist to help you understand the documents you will likely need.${textDetails}

We will keep the guidance clear, practical, and focused on your move.

${DISCLAIMER}`,
    html: `<p>Hi ${escapeHtml(greeting)},</p>
<p>Welcome to Paperia. We are preparing a practical residence permit checklist to help you understand the documents you will likely need.</p>
${htmlDetails}
<p>We will keep the guidance clear, practical, and focused on your move.</p>
<p>${DISCLAIMER}</p>`,
  };
}

export function createSendWelcomeHandler(sendEmail: SendEmail) {
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
      const { error } = await sendEmail(buildWelcomeEmail(input));
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
  return createSendWelcomeHandler((email) => resend.emails.send(email))(req, res);
}
