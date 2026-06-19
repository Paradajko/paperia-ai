import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  validateWizardStep,
  type IntakeErrors,
  type IntakeValues,
  type Purpose,
  type WizardStep,
} from '../lib/intake';
import { saveLead } from '../lib/leads';
import {
  createInitialRiaMessage,
  requestRiaReply,
  RIA_FALLBACK_MESSAGE,
  type ApplicantContext,
  type RiaMessage,
} from '../lib/ria';
import { RiaAvatar } from './RiaAvatar';

type RiaIntakeModalProps = {
  open: boolean;
  onClose: () => void;
};

const initialValues: IntakeValues = {
  name: '',
  nationality: '',
  currentLocation: '',
  purpose: '',
  statusReason: '',
  documents: [],
  concern: '',
  email: '',
  emailSequenceConsent: false,
};

const nationalities = [
  'Ukraine',
  'Serbia',
  'North Macedonia',
  'Bosnia and Herzegovina',
  'Montenegro',
  'Albania',
  'Kosovo',
  'Turkey',
  'India',
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

const stepLabels = [
  'Your destination',
  'Your situation',
  'Documents you have',
  'Your biggest question',
  'Get your checklist',
];

export function RiaIntakeModal({ open, onClose }: RiaIntakeModalProps) {
  const [values, setValues] = useState<IntakeValues>(initialValues);
  const [errors, setErrors] = useState<IntakeErrors>({});
  const [step, setStep] = useState<WizardStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [messages, setMessages] = useState<RiaMessage[]>([]);
  const [followUp, setFollowUp] = useState('');
  const [isRiaLoading, setIsRiaLoading] = useState(false);
  const [riaError, setRiaError] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [pdfError, setPdfError] = useState('');

  if (!open) return null;

  const updateValue = <Key extends keyof IntakeValues>(
    key: Key,
    value: IntakeValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setSubmitError('');
    if (key === 'nationality' || key === 'purpose' || key === 'concern' || key === 'email') {
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

  const moveNext = () => {
    const nextErrors = validateWizardStep(step, values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || step === 5) return;
    setStep((step + 1) as WizardStep);
  };

  const moveBack = () => {
    setErrors({});
    setSubmitError('');
    if (step > 1) {
      setStep((step - 1) as WizardStep);
    }
  };

  const handleWizardSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step < 5) {
      event.preventDefault();
      moveNext();
      return;
    }

    void handleSubmit(event);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateWizardStep(5, values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      setSubmitError('');

      const { error } = await saveLead(values);
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
        currentStep: 'wizard-complete',
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

    const nextMessages: RiaMessage[] = [...messages, { role: 'user', content }];
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

  const handleDownloadPdf = async () => {
    try {
      setIsPdfGenerating(true);
      setPdfError('');
      const { generateChecklistPdf } = await import('../lib/pdf');
      const blob = await generateChecklistPdf(values);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const nationalitySlug = values.nationality
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      link.href = url;
      link.download = `paperia-slovakia-checklist-${nationalitySlug || 'applicant'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    } catch (error: unknown) {
      console.error('PDF generation failed:', error);
      setPdfError('Sorry, your PDF could not be generated right now. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setValues(initialValues);
      setErrors({});
      setStep(1);
      setSubmitted(false);
      setIsSubmitting(false);
      setSubmitError('');
      setMessages([]);
      setFollowUp('');
      setIsRiaLoading(false);
      setRiaError('');
      setIsPdfGenerating(false);
      setPdfError('');
    }, 180);
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-[#0B1726]/36 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ria-intake-title"
    >
      <div className="flex min-h-full items-end justify-center sm:items-center">
        <div className="h-[100dvh] w-full overflow-y-auto bg-[#FFFCF6] shadow-[0_30px_90px_rgba(11,23,38,0.22)] sm:h-auto sm:max-h-[90vh] sm:max-w-5xl sm:rounded-[2rem] sm:border sm:border-[#DDE8DF]">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#DDE8DF] bg-[#FFFCF6]/94 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              <RiaAvatar size="md" className="h-12 w-12 sm:h-16 sm:w-16" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0F8A6A]">
                  Ria · your immigration guide
                </p>
                <h2 id="ria-intake-title" className="text-lg font-semibold text-[#0B1726] sm:text-xl">
                  {submitted ? 'Your Slovakia checklist' : stepLabels[step - 1]}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="rounded-full border border-[#DDE8DF] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#BFE6D2] hover:text-[#0B1726]"
            >
              Close
            </button>
          </div>

          {!submitted ? (
            <div className="p-4 sm:p-6">
              <WizardProgress step={step} />
              <div className="mt-5 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
                <WizardGuide step={step} />
                <form
                  onSubmit={handleWizardSubmit}
                  className="rounded-[1.5rem] border border-[#DDE8DF] bg-white/82 p-4 shadow-sm sm:p-6"
                >
                  <WizardStepContent
                    step={step}
                    values={values}
                    errors={errors}
                    updateValue={updateValue}
                    toggleDocument={toggleDocument}
                  />

                  {submitError && (
                    <p className="mt-4 rounded-2xl border border-[#F2C8B8] bg-[#FFF5EF] px-4 py-3 text-sm font-semibold text-[#B9573D]">
                      {submitError}
                    </p>
                  )}

                  <div className="mt-7 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={moveBack}
                      disabled={step === 1 || isSubmitting}
                      className="rounded-full border border-[#DDE8DF] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0F8A6A]/35 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full bg-[#0F8A6A] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,138,106,0.22)] transition hover:bg-[#0B6F56] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                    >
                      {step === 5
                        ? isSubmitting
                          ? 'Saving and preparing...'
                          : "Show Ria's checklist"
                        : 'Next'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[0.72fr_1.28fr]">
              <CompletionSummary
                values={values}
                isPdfGenerating={isPdfGenerating}
                pdfError={pdfError}
                onDownloadPdf={handleDownloadPdf}
              />
              <RiaConversation
                messages={messages}
                followUp={followUp}
                isLoading={isRiaLoading}
                error={riaError}
                onFollowUpChange={setFollowUp}
                onSubmit={handleFollowUp}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WizardProgress({ step }: { step: WizardStep }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
        <span className="text-[#0F8A6A]">Step {step} of 5</span>
        <span className="text-slate-500">{stepLabels[step - 1]}</span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-[#DDE8DF]"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={step}
      >
        <div
          className="h-full rounded-full bg-[#0F8A6A] transition-all duration-300"
          style={{ width: `${step * 20}%` }}
        />
      </div>
    </div>
  );
}

function WizardGuide({ step }: { step: WizardStep }) {
  const descriptions = [
    'Riadence currently focuses on non-EU citizens moving to Slovakia.',
    'These answers help Ria identify the most relevant residence route.',
    'Checking what you already have makes the PDF document plan more useful.',
    'Tell Ria the uncertainty you want the checklist to address first.',
    'Add your email to save the lead, prepare the checklist, and receive follow-up.',
  ];

  return (
    <aside className="flex min-h-[260px] flex-col justify-between rounded-[1.5rem] border border-[#BFE6D2] bg-[#EEF7F1] p-5">
      <div>
        <p className="text-sm font-semibold text-[#0F8A6A]">{stepLabels[step - 1]}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1726]">
          Five focused steps, not an open-ended chat.
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{descriptions[step - 1]}</p>
      </div>
      <p className="mt-8 rounded-2xl border border-[#DDE8DF] bg-[#FFFCF6] p-4 text-sm font-medium leading-6 text-slate-700">
        I am not a lawyer. Ria provides general information, not legal advice, and cannot guarantee approval.
      </p>
    </aside>
  );
}

function WizardStepContent({
  step,
  values,
  errors,
  updateValue,
  toggleDocument,
}: {
  step: WizardStep;
  values: IntakeValues;
  errors: IntakeErrors;
  updateValue: <Key extends keyof IntakeValues>(key: Key, value: IntakeValues[Key]) => void;
  toggleDocument: (documentName: string) => void;
}) {
  if (step === 1) {
    return (
      <div>
        <h3 className="text-2xl font-semibold text-[#0B1726]">Where are you moving to?</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          We are starting with one destination so the checklist can stay focused and practical.
        </p>
        <label className="mt-6 block">
          <span className="text-sm font-semibold text-slate-800">Destination country</span>
          <input
            value="Slovakia"
            disabled
            className="mt-2 w-full rounded-2xl border border-[#BFE6D2] bg-[#EEF7F1] px-4 py-3 text-sm font-semibold text-[#064E3B] disabled:opacity-100"
          />
        </label>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <h3 className="text-2xl font-semibold text-[#0B1726]">What's your current situation?</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Tell Ria enough to identify the likely route without uploading personal documents.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
      </div>
    );
  }

  if (step === 3) {
    return (
      <fieldset>
        <legend className="text-2xl font-semibold text-[#0B1726]">Documents you already have</legend>
        <p className="mt-2 text-sm leading-6 text-slate-600">Check what you already have ready.</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {documentOptions.map((documentName) => (
            <label
              key={documentName}
              className="flex items-center gap-2 rounded-2xl border border-[#DDE8DF] bg-[#F7FBF8] px-3 py-3 text-sm font-medium text-slate-700"
            >
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
    );
  }

  if (step === 4) {
    return (
      <div>
        <h3 className="text-2xl font-semibold text-[#0B1726]">What worries you most about this process?</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Ria will use this to prioritize the explanation in your first checklist.
        </p>
        <label className="mt-6 block">
          <span className="text-sm font-semibold text-slate-800">Your biggest question</span>
          <textarea
            value={values.concern}
            onChange={(event) => updateValue('concern', event.target.value)}
            rows={6}
            placeholder="Example: I am not sure if my criminal record needs an apostille."
            className={`mt-2 w-full rounded-2xl border bg-white px-3 py-3 text-sm text-slate-800 shadow-sm transition focus:border-[#0F8A6A] ${
              errors.concern ? 'border-[#D97757]' : 'border-[#DDE8DF]'
            }`}
          />
          {errors.concern && (
            <span className="mt-1 block text-sm font-medium text-[#B9573D]">{errors.concern}</span>
          )}
        </label>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold text-[#0B1726]">Get your checklist</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Add your email so Riadence can save your answers and send checklist follow-up.
      </p>
      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Name (optional)</span>
          <input
            value={values.name}
            onChange={(event) => updateValue('name', event.target.value)}
            placeholder="Your name"
            className="mt-2 w-full rounded-2xl border border-[#DDE8DF] bg-white px-3 py-3 text-sm text-slate-800 shadow-sm transition focus:border-[#0F8A6A]"
          />
        </label>
        <label className="block">
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
          {errors.email && (
            <span className="mt-1 block text-sm font-medium text-[#B9573D]">{errors.email}</span>
          )}
        </label>
        <label className="flex items-start gap-3 rounded-2xl border border-[#DDE8DF] bg-white/75 p-4 text-sm leading-6 text-slate-600">
          <input
            type="checkbox"
            checked={values.emailSequenceConsent}
            onChange={(event) =>
              updateValue('emailSequenceConsent', event.target.checked)
            }
            className="mt-1 h-4 w-4 flex-none rounded border-[#BFE6D2] accent-[#0F8A6A]"
          />
          <span>
            Send me the 14-day Riadence email guide with practical residence tips and case examples. I can unsubscribe anytime.{' '}
            <Link
              to="/privacy"
              className="font-semibold text-[#0F8A6A] underline underline-offset-4"
              onClick={(event) => event.stopPropagation()}
            >
              Privacy Policy
            </Link>
          </span>
        </label>
      </div>
      <p className="mt-5 rounded-2xl border border-[#BFE6D2] bg-[#EEF7F1] p-4 text-sm font-semibold leading-6 text-[#064E3B]">
        I am not a lawyer. This checklist is general information, not legal advice. Verify details with an official
        Slovak source or a licensed immigration lawyer.
      </p>
    </div>
  );
}

function CompletionSummary({
  values,
  isPdfGenerating,
  pdfError,
  onDownloadPdf,
}: {
  values: IntakeValues;
  isPdfGenerating: boolean;
  pdfError: string;
  onDownloadPdf: () => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#BFE6D2] bg-white/82 p-5 shadow-sm">
      <RiaAvatar size="lg" className="mx-auto" />
      <p className="mt-5 text-sm font-semibold text-[#0F8A6A]">Wizard complete</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1726]">
        Your Slovakia route is ready to review.
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Prepared for {values.name.trim() || values.email} from {values.nationality}. Ria is answering your first
        question on the right.
      </p>
      <div className="mt-5 rounded-2xl border border-[#BFE6D2] bg-[#EEF7F1] p-4">
        <p className="text-sm font-semibold text-[#064E3B]">Download your PDF</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">
          Your personalized route, document plan, timeline, official links, and legal disclaimer will be available
          here.
        </p>
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isPdfGenerating}
          className="mt-4 w-full rounded-full bg-[#0F8A6A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,138,106,0.18)] transition hover:bg-[#0B6F56] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
        >
          {isPdfGenerating ? 'Generating your PDF...' : 'Download your PDF checklist'}
        </button>
        {pdfError && <p className="mt-3 text-sm font-semibold text-[#B9573D]">{pdfError}</p>}
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
    <div className="rounded-[1.5rem] border border-[#BFE6D2] bg-[#EEF7F1] p-4 sm:p-5">
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <RiaAvatar size="md" />
          <div>
            <p className="text-sm font-semibold text-[#0F8A6A]">Ask Ria</p>
            <p className="text-sm text-slate-600">Follow-up starts after the structured wizard.</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'items-start'}`}
            >
              {message.role === 'assistant' && <RiaAvatar size="sm" className="mt-1 flex-none" />}
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === 'assistant'
                    ? 'border border-[#BFE6D2] bg-[#EEF7F1] text-slate-700'
                    : 'bg-[#0B1726] text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 rounded-2xl border border-[#BFE6D2] bg-[#EEF7F1] px-4 py-3 text-sm font-semibold text-[#0F8A6A]">
              <RiaAvatar size="sm" />
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
          I am not a lawyer. This is general information, not legal advice. No approval guarantee.
        </p>
      </div>
    </div>
  );
}
