export type RiaMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ApplicantContext = {
  nationality: string;
  destinationCountry: string;
  residenceType: string;
  currentStep: string;
};

export type InitialRiaValues = {
  nationality: string;
  currentLocation: string;
  residenceType: string;
  documents: string[];
  concern: string;
};

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export const RIA_FALLBACK_MESSAGE =
  "Sorry, I'm having trouble responding right now. Please try again.";

export function createInitialRiaMessage(values: InitialRiaValues): string {
  const documents = values.documents.length
    ? values.documents.join(', ')
    : 'none selected yet';
  const concern = values.concern.trim() || 'No specific concern provided.';

  return `Please create my first residence checklist.
Nationality: ${values.nationality}
Current location: ${values.currentLocation || 'Not specified'}
Residence type: ${values.residenceType}
Documents I already have: ${documents}
Main question or concern: ${concern}`;
}

function isReplyPayload(value: unknown): value is { reply: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'reply' in value &&
    typeof value.reply === 'string' &&
    value.reply.trim().length > 0
  );
}

export async function requestRiaReply(
  messages: RiaMessage[],
  applicantContext?: ApplicantContext,
  fetcher: Fetcher = fetch,
): Promise<string> {
  try {
    const response = await fetcher('/api/ria-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        ...(applicantContext ? { applicantContext } : {}),
      }),
    });

    const body: unknown = await response.json();
    if (!response.ok || !isReplyPayload(body)) {
      throw new Error('Ria API returned an invalid response');
    }

    return body.reply;
  } catch (error: unknown) {
    console.error('Ria chat request failed:', error);
    throw new Error(RIA_FALLBACK_MESSAGE);
  }
}
