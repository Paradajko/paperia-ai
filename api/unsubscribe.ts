import { createSupabaseAdmin } from './_lib/supabase-admin.js';
import { verifyUnsubscribeToken } from './emails/unsubscribe-token.js';

declare const process: {
  env: Record<string, string | undefined>;
};

type Request = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
};
type Response = {
  status(code: number): Response;
  json(body: unknown): void;
  send(body: string): void;
  redirect(code: number, path: string): void;
};
type Dependencies = {
  unsubscribeSecret: string;
  now?: () => Date;
  unsubscribe(email: string): Promise<void>;
};

function queryValue(
  query: Request['query'],
  key: string,
): string {
  const value = query?.[key];
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export function createUnsubscribeHandler(dependencies: Dependencies) {
  return async function handler(req: Request, res: Response): Promise<void> {
    if (req.method !== 'GET' && req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    const email = queryValue(req.query, 'email').trim().toLowerCase();
    const token = queryValue(req.query, 'token');
    const now = dependencies.now?.() ?? new Date();
    if (
      !email ||
      !verifyUnsubscribeToken(
        email,
        token,
        dependencies.unsubscribeSecret,
        now,
      )
    ) {
      res.status(400).json({ error: 'Invalid or expired unsubscribe link' });
      return;
    }

    await dependencies.unsubscribe(email);
    if (req.method === 'POST') {
      res.status(200).send('');
      return;
    }
    res.redirect(302, '/unsubscribed');
  };
}

export default async function handler(req: Request, res: Response) {
  const supabase = createSupabaseAdmin();
  return createUnsubscribeHandler({
    unsubscribeSecret: process.env.UNSUBSCRIBE_SECRET ?? '',
    unsubscribe: async (email) => {
      const { error } = await supabase.rpc('unsubscribe_email_sequence', {
        target_email: email,
      });
      if (error) throw error;
    },
  })(req, res);
}
