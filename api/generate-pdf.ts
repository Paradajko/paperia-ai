import { pdf } from '@react-pdf/renderer';
import { readFile } from 'node:fs/promises';

import {
  ResidenceChecklistPDF,
} from './_pdf.js';
import type {
  ChecklistApplicantData,
} from './_pdf-data.js';

const MAX_BODY_BYTES = 20 * 1024;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const CLEANUP_INTERVAL = 100;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_FIELDS = new Set([
  'name',
  'nationality',
  'currentLocation',
  'purpose',
  'statusReason',
  'documents',
  'concern',
  'email',
]);

const rateLimitMap = new Map<string, number[]>();
let requestCount = 0;

type ServerlessRequest = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string | undefined };
};

type ServerlessResponse = {
  status(statusCode: number): ServerlessResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  send(body: Buffer): void;
};

type PdfRenderer = (
  applicantData: ChecklistApplicantData,
) => Promise<Buffer>;

type HandlerOptions = {
  renderPdf: PdfRenderer;
  limits?: Map<string, number[]>;
  now?: () => number;
};

type ValidationResult =
  | { data: ChecklistApplicantData }
  | { error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function headerValue(
  headers: ServerlessRequest['headers'],
  name: string,
): string {
  const value = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function bodySize(body: unknown): number {
  if (typeof body === 'string') {
    return Buffer.byteLength(body);
  }
  try {
    return Buffer.byteLength(JSON.stringify(body));
  } catch {
    return MAX_BODY_BYTES + 1;
  }
}

function parseBody(body: unknown): unknown {
  if (typeof body !== 'string') {
    return body;
  }
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function requiredString(
  body: Record<string, unknown>,
  field: keyof ChecklistApplicantData,
  max: number,
): string | { error: string } {
  if (!(field in body)) {
    return { error: `Missing field: ${field}` };
  }
  if (typeof body[field] !== 'string') {
    return { error: `${field}: must be a string` };
  }
  const value = body[field].trim();
  if (!value) {
    return { error: `Missing field: ${field}` };
  }
  if (value.length > max) {
    return { error: `${field}: max ${max} chars` };
  }
  return value;
}

function optionalString(
  body: Record<string, unknown>,
  field: 'concern',
  max: number,
): string | { error: string } {
  if (!(field in body)) {
    return '';
  }
  if (typeof body[field] !== 'string') {
    return { error: `${field}: must be a string` };
  }
  const value = body[field];
  if (value.length > max) {
    return { error: `${field}: max ${max} chars` };
  }
  return value;
}

function documents(
  body: Record<string, unknown>,
): string[] | { error: string } {
  if (!('documents' in body)) {
    return [];
  }
  if (!Array.isArray(body.documents)) {
    return { error: 'documents: must be an array' };
  }
  if (body.documents.length > 20) {
    return { error: 'documents: max 20 items' };
  }
  const result: string[] = [];
  for (const [index, item] of body.documents.entries()) {
    if (typeof item !== 'string') {
      return { error: `documents[${index}]: must be a string` };
    }
    if (item.length > 100) {
      return { error: `documents[${index}]: max 100 chars` };
    }
    result.push(item);
  }
  return result;
}

export function validatePdfPayload(body: unknown): ValidationResult {
  const parsedBody = parseBody(body);
  if (!isRecord(parsedBody)) {
    return { error: 'Invalid JSON body' };
  }

  for (const field of Object.keys(parsedBody)) {
    if (!ALLOWED_FIELDS.has(field)) {
      return { error: `Unknown field: ${field}` };
    }
  }

  const name = requiredString(parsedBody, 'name', 200);
  if (typeof name !== 'string') return name;
  const nationality = requiredString(parsedBody, 'nationality', 100);
  if (typeof nationality !== 'string') return nationality;
  const currentLocation = requiredString(parsedBody, 'currentLocation', 200);
  if (typeof currentLocation !== 'string') return currentLocation;
  const purpose = requiredString(parsedBody, 'purpose', 200);
  if (typeof purpose !== 'string') return purpose;
  const statusReason = requiredString(parsedBody, 'statusReason', 500);
  if (typeof statusReason !== 'string') return statusReason;
  const email = requiredString(parsedBody, 'email', 320);
  if (typeof email !== 'string') return email;
  if (!EMAIL_PATTERN.test(email)) {
    return { error: 'Invalid email' };
  }
  const parsedDocuments = documents(parsedBody);
  if (!Array.isArray(parsedDocuments)) return parsedDocuments;
  const concern = optionalString(parsedBody, 'concern', 1000);
  if (typeof concern !== 'string') return concern;

  return {
    data: {
      name,
      nationality,
      currentLocation,
      purpose,
      statusReason,
      documents: parsedDocuments,
      concern,
      email: email.toLowerCase(),
    },
  };
}

function clientIp(req: ServerlessRequest): string {
  return headerValue(req.headers, 'x-forwarded-for').split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || 'unknown';
}

function isRateLimited(
  ip: string,
  limits: Map<string, number[]>,
  now: number,
): boolean {
  requestCount += 1;
  if (requestCount % CLEANUP_INTERVAL === 0) {
    for (const [key, timestamps] of limits) {
      const active = timestamps.filter((timestamp) => now - timestamp < WINDOW_MS);
      if (active.length) {
        limits.set(key, active);
      } else {
        limits.delete(key);
      }
    }
  }

  const active = (limits.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );
  if (active.length >= MAX_PER_WINDOW) {
    limits.set(ip, active);
    return true;
  }
  active.push(now);
  limits.set(ip, active);
  return false;
}

export function createGeneratePdfHandler({
  renderPdf,
  limits = rateLimitMap,
  now = Date.now,
}: HandlerOptions) {
  return async function handler(
    req: ServerlessRequest,
    res: ServerlessResponse,
  ): Promise<void> {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const contentType = headerValue(req.headers, 'content-type');
    if (!contentType.toLowerCase().startsWith('application/json')) {
      res.status(400).json({ error: 'Content-Type must be application/json' });
      return;
    }

    const contentLength = Number(headerValue(req.headers, 'content-length'));
    if (
      (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES)
      || bodySize(req.body) > MAX_BODY_BYTES
    ) {
      res.status(413).json({ error: 'Payload Too Large' });
      return;
    }

    const validated = validatePdfPayload(req.body);
    if ('error' in validated) {
      res.status(400).json({ error: validated.error });
      return;
    }

    if (isRateLimited(clientIp(req), limits, now())) {
      res.setHeader('Retry-After', '3600');
      res.status(429).json({ error: 'Rate limit exceeded' });
      return;
    }

    try {
      const buffer = await renderPdf(validated.data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="riadence-slovakia-checklist.pdf"',
      );
      res.status(200).send(buffer);
    } catch (error: unknown) {
      console.error('PDF generation failed:', error);
      res.status(500).json({ error: 'PDF generation failed' });
    }
  };
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export default createGeneratePdfHandler({
  renderPdf: async (applicantData) => {
    const avatarSource = await readFile(
      new URL('../src/assets/ria-guide-half.png', import.meta.url),
    );
    const stream = await pdf(
      ResidenceChecklistPDF({ applicantData, avatarSource }),
    ).toBuffer();
    return streamToBuffer(stream);
  },
});
