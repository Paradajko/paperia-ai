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
const RIADENCE_URL = 'https://riadence.com';
const RIA_AVATAR_URL = `${RIADENCE_URL}/ria-guide-half.png`;

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
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;border:1px solid #DDE8DF;border-radius:16px;background:#F7FBF8;">
        ${details
          .map(
            (detail) =>
              `<tr><td style="padding:10px 14px;border-bottom:1px solid #DDE8DF;color:#334155;font-size:14px;">${escapeHtml(detail)}</td></tr>`,
          )
          .join('')}
      </table>`
    : '';

  return {
    from: 'Riadence <hello@riadence.com>',
    to: input.email,
    replyTo: 'hello@riadence.com',
    subject: 'Your Slovakia residence checklist is ready inside',
    text: `Hi ${greeting},

Ria has saved your answers for your Slovakia residence checklist.${textDetails}

Inside Riadence, you can:
- Review your likely residence route and document plan
- Download your personalized PDF checklist
- Ask Ria practical follow-up questions

Open Riadence: ${RIADENCE_URL}

${DISCLAIMER}`,
    html: `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#F4F7F5;font-family:Inter,Arial,sans-serif;color:#0B1726;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F7F5;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;border:1px solid #DDE8DF;border-radius:24px;background:#FFFCF6;overflow:hidden;">
            <tr>
              <td align="center" style="padding:32px 28px 22px;background:linear-gradient(180deg,#EEF7F1 0%,#FFFCF6 100%);">
                <img src="${RIA_AVATAR_URL}" width="96" height="96" alt="Ria, your residence guide for Slovakia" style="display:block;width:96px;height:96px;border:2px solid #BFE6D2;border-radius:50%;background:#EEF7F1;object-fit:cover;object-position:top;">
                <p style="margin:18px 0 0;color:#0F8A6A;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Riadence · guided by Ria</p>
                <h1 style="margin:8px 0 0;font-size:28px;line-height:1.2;color:#0B1726;">Your Slovakia checklist is ready</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 30px 32px;">
                <p style="margin:0;font-size:16px;line-height:1.7;">Hi ${escapeHtml(greeting)},</p>
                <p style="margin:14px 0 0;color:#475569;font-size:15px;line-height:1.7;">Ria has saved your answers and prepared the starting point for your Slovakia residence checklist.</p>
                ${htmlDetails}
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;border-radius:16px;background:#EEF7F1;">
                  <tr><td style="padding:18px;">
                    <p style="margin:0;color:#064E3B;font-size:15px;font-weight:700;">What you can do next</p>
                    <ul style="margin:10px 0 0;padding-left:20px;color:#334155;font-size:14px;line-height:1.8;">
                      <li>Review your likely residence route and document plan</li>
                      <li>Download your personalized PDF checklist</li>
                      <li>Ask Ria practical follow-up questions</li>
                    </ul>
                  </td></tr>
                </table>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px auto;">
                  <tr>
                    <td style="border-radius:999px;background:#0F8A6A;">
                      <a href="${RIADENCE_URL}" style="display:inline-block;padding:13px 24px;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;">Open Riadence</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:22px 0 0;border-top:1px solid #DDE8DF;padding-top:18px;color:#64748B;font-size:12px;line-height:1.6;">${DISCLAIMER}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
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
