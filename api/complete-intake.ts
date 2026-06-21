import { Resend } from 'resend';

import { createSupabaseAdmin } from './_lib/supabase-admin.js';
import { buildUnsubscribeUrl } from './emails/unsubscribe-token.js';
import {
  buildSequenceEmail,
  type SequenceEmail,
} from './emails/templates.js';

declare const process: {
  env: Record<string, string | undefined>;
};

type ServerlessRequest = { method?: string; body?: unknown };
type ServerlessResponse = {
  status(statusCode: number): ServerlessResponse;
  json(body: unknown): void;
};

type AppLocale = 'en' | 'sk' | 'rs' | 'ua';

export type CompleteIntakeInput = {
  email: string;
  name?: string;
  nationality: string;
  currentLocation: string;
  purpose: string;
  statusReason: string;
  documents: string[];
  concern: string;
  emailSequenceConsent: boolean;
  locale: AppLocale;
};

type CompleteResult = {
  leadId: string;
  sequenceId: string;
  sequenceCount: number;
};

type SequenceUpdate = {
  status: 'sent' | 'failed';
  sent_at?: string;
  error_message?: string | null;
};

type Dependencies = {
  completeIntake(input: CompleteIntakeInput): Promise<CompleteResult>;
  sendEmail(email: SequenceEmail): Promise<{ error: unknown | null }>;
  updateSequence(id: string, values: SequenceUpdate): Promise<void>;
  createContact(input: {
    email: string;
    firstName?: string;
    unsubscribed: false;
  }): Promise<{ error: unknown | null }>;
  unsubscribeSecret: string;
  now?: () => Date;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(body: Record<string, unknown>, key: string): string {
  return typeof body[key] === 'string' ? body[key].trim() : '';
}

function locale(body: Record<string, unknown>): AppLocale {
  const value = text(body, 'locale');
  return value === 'sk' || value === 'rs' || value === 'ua' ? value : 'en';
}

function parseInput(body: unknown): CompleteIntakeInput | null {
  if (!isRecord(body)) {
    return null;
  }
  const email = text(body, 'email').toLowerCase();
  const nationality = text(body, 'nationality');
  const purpose = text(body, 'purpose');
  const concern = text(body, 'concern');
  if (
    !/^\S+@\S+\.\S+$/.test(email) ||
    !nationality ||
    !purpose ||
    !concern
  ) {
    return null;
  }
  return {
    email,
    name: text(body, 'name') || undefined,
    nationality,
    currentLocation: text(body, 'currentLocation'),
    purpose,
    statusReason: text(body, 'statusReason'),
    documents: Array.isArray(body.documents)
      ? body.documents.filter((item): item is string => typeof item === 'string')
      : [],
    concern,
    emailSequenceConsent: body.emailSequenceConsent === true,
    locale: locale(body),
  };
}

function errorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.slice(0, 500);
}

export function createCompleteIntakeHandler(dependencies: Dependencies) {
  return async function handler(
    req: ServerlessRequest,
    res: ServerlessResponse,
  ): Promise<void> {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    const input = parseInput(req.body);
    if (!input) {
      res.status(400).json({ error: 'A valid email is required' });
      return;
    }

    try {
      const completion = await dependencies.completeIntake(input);
      if (input.emailSequenceConsent) {
        const { error } = await dependencies.createContact({
          email: input.email,
          firstName: input.name,
          unsubscribed: false,
        });
        if (error) {
          console.error('Failed to create Resend contact:', error);
        }
      }

      const now = dependencies.now?.() ?? new Date();
      const email = buildSequenceEmail('welcome', {
        email: input.email,
        name: input.name,
        nationality: input.nationality,
        destinationCountry: 'Slovakia',
        residenceType: input.purpose,
        locale: input.locale,
        unsubscribeUrl: buildUnsubscribeUrl(
          input.email,
          dependencies.unsubscribeSecret,
          now,
        ),
      });
      const { error } = await dependencies.sendEmail(email);
      if (error) {
        await dependencies.updateSequence(completion.sequenceId, {
          status: 'failed',
          error_message: errorMessage(error),
        });
        res.status(200).json({
          ok: true,
          sequenceCount: completion.sequenceCount,
          warning: 'Welcome email delivery failed',
        });
        return;
      }

      await dependencies.updateSequence(completion.sequenceId, {
        status: 'sent',
        sent_at: now.toISOString(),
        error_message: null,
      });
      res.status(200).json({
        ok: true,
        sequenceCount: completion.sequenceCount,
      });
    } catch (error: unknown) {
      console.error('Failed to complete intake:', error);
      res.status(500).json({ error: 'Failed to save your checklist' });
    }
  };
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse,
): Promise<void> {
  const supabase = createSupabaseAdmin();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET;
  if (!unsubscribeSecret) {
    res.status(500).json({ error: 'Email service is not configured' });
    return;
  }

  return createCompleteIntakeHandler({
    unsubscribeSecret,
    completeIntake: async (input) => {
      const { data, error } = await supabase.rpc('complete_intake', {
        input_email: input.email,
        input_name: input.name ?? '',
        input_nationality: input.nationality,
        input_current_location: input.currentLocation,
        input_purpose: input.purpose,
        input_status_reason: input.statusReason,
        input_documents: input.documents,
        input_concern: input.concern,
        input_email_sequence_consent: input.emailSequenceConsent,
        input_locale: input.locale,
      });
      if (error || !data?.[0]) {
        throw error ?? new Error('Completion RPC returned no data');
      }
      return {
        leadId: data[0].lead_id,
        sequenceId: data[0].sequence_id,
        sequenceCount: data[0].sequence_count,
      };
    },
    sendEmail: (email) => resend.emails.send(email),
    createContact: (contact) => resend.contacts.create(contact),
    updateSequence: async (id, values) => {
      const { error } = await supabase
        .from('email_sequence')
        .update(values)
        .eq('id', id);
      if (error) {
        throw error;
      }
    },
  })(req, res);
}
