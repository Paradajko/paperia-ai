export type LeadFormValues = {
  email: string;
  name?: string;
  nationality: string;
  currentLocation: string;
  purpose: string;
  statusReason: string;
  documents: string[];
  concern: string;
};

export type LeadInsert = {
  email: string;
  nationality: string;
  current_location: string;
  purpose: string;
  status_reason: string;
  documents: string[];
  concern: string;
  checklist_route: null;
  source: 'web';
  status: 'new';
};

type LeadSaveResult = {
  error: unknown | null;
};

type LeadStorage = {
  from(table: string): {
    insert(payload: LeadInsert): PromiseLike<LeadSaveResult>;
  };
};

type Schedule = (callback: () => void, delay: number) => number;

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export function buildLeadInsert(values: LeadFormValues): LeadInsert {
  return {
    email: values.email,
    nationality: values.nationality,
    current_location: values.currentLocation,
    purpose: values.purpose,
    status_reason: values.statusReason,
    documents: values.documents,
    concern: values.concern,
    checklist_route: null,
    source: 'web',
    status: 'new',
  };
}

function scheduleWelcomeEmail(
  values: LeadFormValues,
  schedule: Schedule,
  fetcher: Fetcher,
): void {
  schedule(() => {
    void fetcher('/api/send-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: values.email,
        name: values.name,
        nationality: values.nationality,
        destinationCountry: 'Slovakia',
        residenceType: values.purpose,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Welcome email request failed with ${response.status}`);
        }
      })
      .catch((error: unknown) => {
        console.error('Welcome email request failed:', error);
      });
  }, 100);
}

export async function saveLead(
  values: LeadFormValues,
  storage: LeadStorage,
  schedule: Schedule = window.setTimeout,
  fetcher: Fetcher = fetch,
): Promise<LeadSaveResult> {
  const result = await storage.from('leads').insert(buildLeadInsert(values));

  if (!result.error) {
    scheduleWelcomeEmail(values, schedule, fetcher);
  }

  return result;
}
