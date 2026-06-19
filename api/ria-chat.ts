import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

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

type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ApplicantContext = {
  nationality?: string;
  destinationCountry?: string;
  residenceType?: string;
  currentStep?: string;
};

type RiaChatRequest = {
  messages: ConversationMessage[];
  applicantContext?: ApplicantContext;
};

type CompletionRequest = {
  model: 'gpt-4o-mini';
  messages: ChatCompletionMessageParam[];
  max_tokens: 600;
  temperature: 0.4;
};

type CreateCompletion = (request: CompletionRequest) => Promise<string>;

const SYSTEM_PROMPT = `You are Ria, a helpful AI assistant for Riadence, a free residence permit checklist tool for non-EU citizens moving to Europe.
Your role: help users understand what documents they likely need for their residence permit, in plain English.
Tone: friendly, practical, concise. Use short paragraphs and bullet points.
Language: English only.
IMPORTANT RULES:
- You are NOT a lawyer. Always include a brief 'Note: I am an AI assistant, not a lawyer. This is general information, not legal advice. Verify details with an official source or a licensed immigration lawyer.' at the end of substantive answers.
- Never guarantee visa approval or outcomes.
- When unsure, say so and recommend consulting the official government website of the destination country or a licensed immigration lawyer.
- Riadence is free. We do not charge for checklist generation. We may recommend partner agencies only when the case is genuinely complex (asylum, deportation defense, appeals).`;

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

function parseMessage(value: unknown): ConversationMessage | null {
  if (!isRecord(value)) {
    return null;
  }

  const role = value.role;
  const content = optionalString(value, 'content');
  if ((role !== 'user' && role !== 'assistant') || !content) {
    return null;
  }

  return { role, content };
}

function parseApplicantContext(value: unknown): ApplicantContext | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    nationality: optionalString(value, 'nationality'),
    destinationCountry: optionalString(value, 'destinationCountry'),
    residenceType: optionalString(value, 'residenceType'),
    currentStep: optionalString(value, 'currentStep'),
  };
}

function parseRiaChatRequest(body: unknown): RiaChatRequest | null {
  if (!isRecord(body) || !Array.isArray(body.messages) || !body.messages.length) {
    return null;
  }

  const messages = body.messages.map(parseMessage);
  if (messages.some((message) => message === null)) {
    return null;
  }

  return {
    messages: messages as ConversationMessage[],
    applicantContext: parseApplicantContext(body.applicantContext),
  };
}

function buildContextPrompt(context: ApplicantContext | undefined): string {
  if (!context) {
    return SYSTEM_PROMPT;
  }

  const details = [
    context.nationality ? `Nationality: ${context.nationality}` : null,
    context.destinationCountry
      ? `Destination country: ${context.destinationCountry}`
      : null,
    context.residenceType ? `Residence type: ${context.residenceType}` : null,
    context.currentStep ? `Current step: ${context.currentStep}` : null,
  ].filter((detail): detail is string => detail !== null);

  return details.length
    ? `${SYSTEM_PROMPT}\n\nApplicant context:\n- ${details.join('\n- ')}`
    : SYSTEM_PROMPT;
}

export function createRiaChatHandler(createCompletion: CreateCompletion) {
  return async function handler(
    req: ServerlessRequest,
    res: ServerlessResponse,
  ): Promise<void> {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const input = parseRiaChatRequest(req.body);
    if (!input) {
      res.status(500).json({ error: 'A non-empty messages array is required' });
      return;
    }

    try {
      const reply = await createCompletion({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: buildContextPrompt(input.applicantContext) },
          ...input.messages,
        ],
        max_tokens: 600,
        temperature: 0.4,
      });

      res.status(200).json({ reply });
    } catch (error: unknown) {
      console.error('Failed to create Ria chat completion:', error);
      res.status(500).json({ error: 'Failed to create Ria chat response' });
    }
  };
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse,
): Promise<void> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return createRiaChatHandler(async (request) => {
    const completion = await openai.chat.completions.create(request);
    const reply = completion.choices[0]?.message.content;

    if (!reply) {
      throw new Error('OpenAI returned an empty response');
    }

    return reply;
  })(req, res);
}
