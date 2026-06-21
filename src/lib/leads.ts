type AppLocale = 'en' | 'sk' | 'rs' | 'ua';

export type LeadFormValues = {
  email: string;
  name?: string;
  nationality: string;
  currentLocation: string;
  purpose: string;
  statusReason: string;
  documents: string[];
  concern: string;
  emailSequenceConsent?: boolean;
  locale: AppLocale;
};

type LeadSaveResult = {
  error: unknown | null;
};

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export async function saveLead(
  values: LeadFormValues,
  fetcher: Fetcher = fetch,
): Promise<LeadSaveResult> {
  try {
    const response = await fetcher('/api/complete-intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        emailSequenceConsent: values.emailSequenceConsent ?? false,
        locale: values.locale ?? 'en',
      }),
    });
    if (!response.ok) {
      throw new Error(`Checklist completion failed with ${response.status}`);
    }
    return { error: null };
  } catch (error: unknown) {
    return { error };
  }
}
