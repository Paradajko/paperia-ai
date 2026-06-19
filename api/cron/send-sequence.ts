import { Resend } from 'resend';

import { createSupabaseAdmin } from '../_lib/supabase-admin.js';
import { buildUnsubscribeUrl } from '../emails/unsubscribe-token.js';
import {
  buildSequenceEmail,
  type EmailTemplateKey,
  type SequenceEmail,
} from '../emails/templates.js';

declare const process: {
  env: Record<string, string | undefined>;
};

type Request = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
};
type Response = {
  status(code: number): Response;
  json(body: unknown): void;
};
type Candidate = {
  id: string;
  lead_id: string;
  email: string;
  step: number;
  template_key: string;
};
type Lead = {
  name: string | null;
  nationality: string | null;
  purpose: string | null;
  email_sequence_consent: boolean;
};
type Update = {
  status: 'sent' | 'failed' | 'unsubscribed';
  sent_at?: string;
  error_message?: string | null;
};
type Dependencies = {
  cronSecret: string;
  unsubscribeSecret: string;
  now?: () => Date;
  fetchDue(limit: number): Promise<Candidate[]>;
  claim(id: string): Promise<unknown | null>;
  getLead(id: string): Promise<Lead | null>;
  sendEmail(email: SequenceEmail): Promise<{ error: unknown | null }>;
  updateSequence(id: string, values: Update): Promise<void>;
};

const TEMPLATE_KEYS = new Set<EmailTemplateKey>([
  'welcome',
  'education-day2',
  'checklist-reminder-day5',
  'case-study-day8',
  'agency-handoff-day14',
]);

function bratislavaHour(date: Date): number {
  const hour = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bratislava',
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(date);
  return Number(hour);
}

function bearer(headers: Request['headers']): string {
  const value = headers?.authorization;
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function boundedError(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).slice(0, 500);
}

export function createSendSequenceHandler(dependencies: Dependencies) {
  return async function handler(req: Request, res: Response): Promise<void> {
    if (
      !dependencies.cronSecret ||
      bearer(req.headers) !== `Bearer ${dependencies.cronSecret}`
    ) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const now = dependencies.now?.() ?? new Date();
    if (bratislavaHour(now) !== 9) {
      res.status(200).json({ skipped: true });
      return;
    }

    const candidates = await dependencies.fetchDue(50);
    let processed = 0;
    let sent = 0;
    let failed = 0;
    let unsubscribed = 0;

    for (const candidate of candidates) {
      const claimed = await dependencies.claim(candidate.id);
      if (!claimed) {
        continue;
      }
      processed += 1;
      try {
        const lead = await dependencies.getLead(candidate.lead_id);
        if (!lead) {
          throw new Error('Lead not found');
        }
        if (candidate.step > 1 && !lead.email_sequence_consent) {
          await dependencies.updateSequence(candidate.id, {
            status: 'unsubscribed',
            error_message: null,
          });
          unsubscribed += 1;
          continue;
        }
        if (!TEMPLATE_KEYS.has(candidate.template_key as EmailTemplateKey)) {
          throw new Error('Unknown email template');
        }
        const email = buildSequenceEmail(
          candidate.template_key as EmailTemplateKey,
          {
            email: candidate.email,
            name: lead.name,
            nationality: lead.nationality,
            destinationCountry: 'Slovakia',
            residenceType: lead.purpose,
            unsubscribeUrl: buildUnsubscribeUrl(
              candidate.email,
              dependencies.unsubscribeSecret,
              now,
            ),
          },
        );
        const result = await dependencies.sendEmail(email);
        if (result.error) {
          throw result.error;
        }
        await dependencies.updateSequence(candidate.id, {
          status: 'sent',
          sent_at: now.toISOString(),
          error_message: null,
        });
        sent += 1;
      } catch (error: unknown) {
        await dependencies.updateSequence(candidate.id, {
          status: 'failed',
          error_message: boundedError(error),
        });
        failed += 1;
      }
    }

    res.status(200).json({ processed, sent, failed, unsubscribed });
  };
}

export default async function handler(req: Request, res: Response) {
  const supabase = createSupabaseAdmin();
  const resend = new Resend(process.env.RESEND_API_KEY);
  return createSendSequenceHandler({
    cronSecret: process.env.CRON_SECRET ?? '',
    unsubscribeSecret: process.env.UNSUBSCRIBE_SECRET ?? '',
    fetchDue: async (limit) => {
      const { data, error } = await supabase
        .from('email_sequence')
        .select('id, lead_id, email, step, template_key')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
    claim: async (id) => {
      const { data, error } = await supabase.rpc('claim_email_sequence', {
        sequence_id: id,
      });
      if (error) throw error;
      return data?.[0] ?? null;
    },
    getLead: async (id) => {
      const { data, error } = await supabase
        .from('leads')
        .select('name, nationality, purpose, email_sequence_consent')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    sendEmail: (email) => resend.emails.send(email),
    updateSequence: async (id, values) => {
      const { error } = await supabase
        .from('email_sequence')
        .update(values)
        .eq('id', id);
      if (error) throw error;
    },
  })(req, res);
}
