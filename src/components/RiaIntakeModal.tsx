import { useState, type FormEvent } from 'react';
import { buildLeadInsert } from '../lib/leads';
import {
  createInitialRiaMessage,
  requestRiaReply,
  RIA_FALLBACK_MESSAGE,
  type ApplicantContext,
  type RiaMessage,
} from '../lib/ria';
import { supabase } from '../lib/supabase';

type Purpose = '' | 'employment' | 'study' | 'family' | 'business' | 'other';

type IntakeValues = {
  nationality: string;
  currentLocation: string;
  purpose: Purpose;
  statusReason: string;
  documents: string[];
  concern: string;
  email: string;
};

type IntakeErrors = Partial<Record<'nationality' | 'purpose' | 'email', string>>;

type RiaIntakeModalProps = {
  open: boolean;
  onClose: () => void;
};

const initialValues: IntakeValues = {
  nationality: '',
  currentLocation: '',
  purpose: '',
  statusReason: '',
  documents: [],
  concern: '',
  email: '',
};

const nationalities = [
  'Ukraine',
  'Serbia',
  'Turkey',
  'India',
  'United Kingdom',
  'United States',
  'Brazil',
  'Georgia',
  'Vietnam',
  'Other non-EU country',
];

const locations = [
  'Outside Slovakia',
  'Already in Slovakia',
  'In another EU country',
  'Not sure yet',
];

const statusReasons = [
  'I have an employer or job offer',
  'I have a school admission',
  'I am joining family',
  'I have a business plan',
  'I am still comparing options',
  'Not sure',
];

const documentOptions = [
  'Passport',
  'Criminal record extract',
  'Accommodation proof',
  'Proof of financial means',
  'Employment contract or job offer',
  'School acceptance letter',
  'Family relationship document',
  'Business plan or trade documents',
  'Health insurance proof',
  'Passport photos',
];

const purposeLabels: Record<Exclude<Purpose, ''>, string> = {
  employment: 'Employment',
  study: 'Study',
  family: 'Family reunification',
  business: 'Business / self-employment',
  other: 'Other / not sure',
};

export function RiaIntakeModal({ open, onClose }: RiaIntakeModalProps) {
  const [values, setValues] = useState<IntakeValues>(initialValues);
  const [errors, setErrors] = useState<IntakeErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [messages, setMessages] = useState<RiaMessage[]>([]);
  const [followUp, setFollowUp] = useState('');
  const [isRiaLoading, setIsRiaLoading] = useState(false);
  const [riaError, setRiaError] = useState('');

  if (!open) return null;

  const updateValue = <Key extends keyof IntakeValues>(key: Key, value: IntakeValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setSubmitError('');
    if (key === 'nationality' || key === 'purpose' || key === 'email') {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const toggleDocument = (documentName: string) => {
    setValues((current) => ({
      ...current,
      documents: current.documents.includes(documentName)
        ? current.documents.filter((item) => item !== documentName)
        : [...current.documents, documentName],
    }));
  };

  const validate = () => {
    const nextErrors: IntakeErrors = {};
    if (!values.nationality) nextErrors.nationality = 'Choose your nationality.';
    if (!values.purpose) nextErrors.purpose = 'Choose your purpose of stay.';
    if (!values.email) {
      nextErrors.email = 'Enter your email.';
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    if (!supabase) {
      setSubmitError('Something went wrong. Please try again.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');

      const { error } = await supabase.from('leads').insert(buildLeadInsert(values));

      if (error) {
        setSubmitError('Something went wrong. Please try again.');
        return;
      }

      const initialMessage: RiaMessage = {
        role: 'user',
        content: createInitialRiaMessage({
          nationality: values.nationality,
          currentLocation: values.currentLocation,
          residenceType: values.purpose,
          documents: values.documents,
          concern: values.concern,
        }),
      };
      const initialMessages = [initialMessage];
      const applicantContext: ApplicantContext = {
        nationality: values.nationality,
        destinationCountry: 'Slovakia',
        residenceType: values.purpose,
        currentStep: 'first-checklist',
      };

      setMessages(initialMessages);
      setSubmitted(true);
      setIsRiaLoading(true);
      setRiaError('');

      try {
        const reply = await requestRiaReply(initialMessages, applicantContext);
        setMessages([...initialMessages, { role: 'assistant', content: reply }]);
      } catch {
        setRiaError(RIA_FALLBACK_MESSAGE);
      } finally {
        setIsRiaLoading(false);
      }
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollowUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = followUp.trim();
    if (!content || isRiaLoading) return;

    const nextMessages: RiaMessage[] = [
      ...messages,
      { role: 'user', content },
    ];
    setMessages(nextMessages);
    setFollowUp('');
    setRiaError('');
    setIsRiaLoading(true);

    try {
      const reply = await requestRiaReply(nextMessages);
      setMessages([...nextMessages, { role: 'assistant', content: reply }]);
    } catch {
      setRiaError(RIA_FALLBACK_MESSAGE);
    } finally {
      setIsRiaLoading(false);
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setIsSubmitting(false);
      setSubmitError('');
      setErrors({});
      setMessages([]);
      setFollowUp('');
      setIsRiaLoading(false);
      setRiaError('');
    }, 180);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-[#0B1726]/36 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="ria-intake-title">
      <div className="flex min-h-full items-end justify-center sm:items-center">
        <div className="h-[100dvh] w-full overflow-y-auto bg-[#FFFCF6] shadow-[0_30px_90px_rgba(11,23,38,0.22)] sm:h-auto sm:max-h-[90vh] sm:max-w-5xl sm:rounded-[2rem] sm:border sm:border-[#DDE8DF]">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#DDE8DF] bg-[#FFFCF6]/94 px-4 py-4 backdrop-blur sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0F8A6A]">Ria intake</p>
              <h2 id="ria-intake-title" className="text-xl font-semibold text-[#0B1726]">
                Get your first checklist
              </h2>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="rounded-full border border-[#DDE8DF] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#BFE6D2] hover:text-[#0B1726]"
            >
              Close
            </button>
          </div>

          <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_0.9fr]">
            {submitted ? (
              <div className="rounded-[1.5rem] border border-[#BFE6D2] bg-white/82 p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#0F8A6A]">Lead saved</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1726]">
                  Thank you. Ria is preparing your checklist.
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Your answers are saved. You can review the first checklist on the right.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-[#DDE8DF] bg-white/82 p-4 shadow-sm sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Nationality"
                    value={values.nationality}
                    placeholder="Choose nationality"
                    options={nationalities}
                    error={errors.nationality}
                    onChange={(value) => updateValue('nationality', value)}
                    required
                  />
                  <SelectField
                    label="Current location"
                    value={values.currentLocation}
                    placeholder="Where are you now?"
                    options={locations}
                    onChange={(value) => updateValue('currentLocation', value)}
                  />
                  <SelectField
                    label="Purpose of stay"
                    value={values.purpose}
                    placeholder="Choose purpose"
                    options={Object.entries(purposeLabels).map(([value, label]) => ({ value, label }))}
                    error={errors.purpose}
                    onChange={(value) => updateValue('purpose', value as Purpose)}
                    required
                  />
                  <SelectField
                    label="Current status / reason"
                    value={values.statusReason}
                    placeholder="What best describes you?"
                    options={statusReasons}
                    onChange={(value) => updateValue('statusReason', value)}
                  />
                </div>

                <fieldset className="mt-5">
                  <legend className="text-sm font-semibold text-slate-800">Documents you already have</legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {documentOptions.map((documentName) => (
                      <label key={documentName} className="flex items-center gap-2 rounded-2xl border border-[#DDE8DF] bg-[#F7FBF8] px-3 py-2 text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={values.documents.includes(documentName)}
                          onChange={() => toggleDocument(documentName)}
                          className="h-4 w-4 rounded border-[#BFE6D2] accent-[#0F8A6A]"
                        />
                        {documentName}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="mt-5 block">
                  <span className="text-sm font-semibold text-slate-800">Biggest question or concern</span>
                  <textarea
                    value={values.concern}
                    onChange={(event) => updateValue('concern', event.target.value)}
                    rows={3}
                    placeholder="Example: I am not sure if my criminal record needs apostille."
                    className="mt-2 w-full rounded-2xl border border-[#DDE8DF] bg-white px-3 py-3 text-sm text-slate-800 shadow-sm transition focus:border-[#0F8A6A]"
                  />
                </label>

                <label className="mt-5 block">
                  <span className="text-sm font-semibold text-slate-800">Email</span>
                  <input
                    type="email"
                    value={values.email}
                    onChange={(event) => updateValue('email', event.target.value)}
                    placeholder="you@example.com"
                    className={`mt-2 w-full rounded-2xl border bg-white px-3 py-3 text-sm text-slate-800 shadow-sm transition focus:border-[#0F8A6A] ${
                      errors.email ? 'border-[#D97757]' : 'border-[#DDE8DF]'
                    }`}
                  />
                  {errors.email && <span className="mt-1 block text-sm font-medium text-[#B9573D]">{errors.email}</span>}
                </label>

                {submitError && (
                  <p className="mt-4 rounded-2xl border border-[#F2C8B8] bg-[#FFF5EF] px-4 py-3 text-sm font-semibold text-[#B9573D]">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full rounded-full bg-[#0F8A6A] px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,138,106,0.22)] transition hover:bg-[#0B6F56] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                >
                  {isSubmitting ? 'Saving...' : "Show Ria's first checklist"}
                </button>
                <p className="mt-3 text-center text-xs font-medium leading-5 text-slate-600">
                  I am not a lawyer. This is guidance only, not legal advice.
                </p>
              </form>
            )}

            <aside className="rounded-[1.5rem] border border-[#BFE6D2] bg-[#EEF7F1] p-4 sm:p-5">
              {!submitted ? (
                <div className="flex h-full min-h-[320px] flex-col justify-between rounded-3xl bg-white/76 p-5">
                  <div>
                    <p className="text-sm font-semibold text-[#0F8A6A]">Ria is ready</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1726]">Answer a few basics.</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Ria will create a first route, likely missing documents, risks, and next steps after your
                      request is saved.
                    </p>
                  </div>
                  <p className="mt-8 rounded-2xl border border-[#DDE8DF] bg-[#FFFCF6] p-4 text-sm font-medium leading-6 text-slate-700">
                    I am not a lawyer. This is guidance only, not legal advice. No application filing or approval
                    guarantee.
                  </p>
                </div>
              ) : (
                <RiaConversation
                  messages={messages}
                  followUp={followUp}
                  isLoading={isRiaLoading}
                  error={riaError}
                  onFollowUpChange={setFollowUp}
                  onSubmit={handleFollowUp}
                />
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  placeholder,
  options,
  error,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: Array<string | { value: string; label: string }>;
  error?: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">
        {label}
        {required && <span className="text-[#D97757]"> *</span>}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-2xl border bg-white px-3 py-3 text-sm font-medium text-slate-800 shadow-sm transition focus:border-[#0F8A6A] ${
          error ? 'border-[#D97757]' : 'border-[#DDE8DF]'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const normalized = typeof option === 'string' ? { value: option, label: option } : option;
          return (
            <option key={normalized.value} value={normalized.value}>
              {normalized.label}
            </option>
          );
        })}
      </select>
      {error && <span className="mt-1 block text-sm font-medium text-[#B9573D]">{error}</span>}
    </label>
  );
}

function RiaConversation({
  messages,
  followUp,
  isLoading,
  error,
  onFollowUpChange,
  onSubmit,
}: {
  messages: RiaMessage[];
  followUp: string;
  isLoading: boolean;
  error: string;
  onFollowUpChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-[#0F8A6A]">Ria's first checklist</p>
      <div className="mt-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === 'assistant'
                ? 'border border-[#BFE6D2] bg-[#EEF7F1] text-slate-700'
                : 'ml-6 bg-[#0B1726] text-white'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="rounded-2xl border border-[#BFE6D2] bg-[#EEF7F1] px-4 py-3 text-sm font-semibold text-[#0F8A6A]">
            Ria is preparing a response...
          </div>
        )}
        {error && (
          <p className="rounded-2xl border border-[#F2C8B8] bg-[#FFF5EF] px-4 py-3 text-sm font-semibold text-[#B9573D]">
            {error}
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Ask a follow-up question</span>
          <textarea
            value={followUp}
            onChange={(event) => onFollowUpChange(event.target.value)}
            rows={3}
            placeholder="Ask Ria about your documents or next steps."
            className="mt-2 w-full rounded-2xl border border-[#DDE8DF] bg-white px-3 py-3 text-sm text-slate-800 shadow-sm transition focus:border-[#0F8A6A]"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading || !followUp.trim()}
          className="mt-3 w-full rounded-full bg-[#0F8A6A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,138,106,0.18)] transition hover:bg-[#0B6F56] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
        >
          {isLoading ? 'Ria is responding...' : 'Ask Ria'}
        </button>
      </form>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        I am not a lawyer. This is guidance only, not legal advice. No approval guarantee.
      </p>
    </div>
  );
}
