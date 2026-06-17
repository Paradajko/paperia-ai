import { useMemo, useState, type FormEvent } from 'react';

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

const checklistByPurpose: Record<Exclude<Purpose, ''>, {
  route: string;
  missing: string[];
  risks: string[];
  nextSteps: string[];
  handoff: string;
}> = {
  employment: {
    route: 'Temporary residence for employment in Slovakia',
    missing: ['Employment contract or promise of employment', 'Translated criminal record', 'Accommodation proof'],
    risks: ['Criminal records often need translation and legalization', 'Employer documents must match the residence route'],
    nextSteps: ['Confirm employer paperwork', 'Check criminal record age and translation needs', 'Prepare accommodation proof'],
    handoff: 'Optional expert handoff if your employer, job title, or document timing is unclear.',
  },
  study: {
    route: 'Temporary residence for study in Slovakia',
    missing: ['School admission confirmation', 'Proof of financial means', 'Accommodation proof'],
    risks: ['Admission letters and bank proofs must be current', 'Some foreign documents may need official translation'],
    nextSteps: ['Confirm admission format', 'Prepare financial proof', 'Check translation needs for foreign documents'],
    handoff: 'Optional expert handoff if your school start date is close or documents are from multiple countries.',
  },
  family: {
    route: 'Temporary residence for family reunification',
    missing: ['Family relationship proof', 'Sponsor residence/status proof', 'Accommodation proof'],
    risks: ['Marriage/birth documents may need apostille or legalization', 'Sponsor income or housing proof can be reviewed closely'],
    nextSteps: ['Collect relationship documents', 'Check legalization rules', 'Prepare sponsor-side documents'],
    handoff: 'Expert handoff is useful if relationship documents were issued abroad or your sponsor status is complex.',
  },
  business: {
    route: 'Temporary residence for business or self-employment',
    missing: ['Business plan or trade documents', 'Financial proof', 'Accommodation proof'],
    risks: ['Business purpose must be credible and documented', 'Financial thresholds and company/trade setup details matter'],
    nextSteps: ['Clarify business structure', 'Prepare financial proof', 'Organize trade or company documents'],
    handoff: 'Expert handoff is recommended if you have not yet set up the business structure.',
  },
  other: {
    route: 'Route unclear from the first answers',
    missing: ['Purpose evidence', 'Identity documents', 'Proof of accommodation or stay plan'],
    risks: ['Choosing the wrong route can waste time', 'Document requirements change by purpose and personal situation'],
    nextSteps: ['Clarify why you want to stay', 'Collect basic identity and location details', 'Ask an expert before filing'],
    handoff: 'Expert handoff is recommended because your route needs clarification before document preparation.',
  },
};

type ChecklistResult = (typeof checklistByPurpose)[Exclude<Purpose, ''>];

export function RiaIntakeModal({ open, onClose }: RiaIntakeModalProps) {
  const [values, setValues] = useState<IntakeValues>(initialValues);
  const [errors, setErrors] = useState<IntakeErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!values.purpose) return null;
    return checklistByPurpose[values.purpose];
  }, [values.purpose]);

  if (!open) return null;

  const updateValue = <Key extends keyof IntakeValues>(key: Key, value: IntakeValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setErrors({});
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

              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-[#0F8A6A] px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,138,106,0.22)] transition hover:bg-[#0B6F56]"
              >
                Show Ria's first checklist
              </button>
            </form>

            <aside className="rounded-[1.5rem] border border-[#BFE6D2] bg-[#EEF7F1] p-4 sm:p-5">
              {!submitted || !result ? (
                <div className="flex h-full min-h-[320px] flex-col justify-between rounded-3xl bg-white/76 p-5">
                  <div>
                    <p className="text-sm font-semibold text-[#0F8A6A]">Ria is ready</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1726]">Answer a few basics.</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Ria will create a first route, likely missing documents, risks, and next steps. This stays
                      frontend-only in the MVP.
                    </p>
                  </div>
                  <p className="mt-8 rounded-2xl border border-[#DDE8DF] bg-[#FFFCF6] p-4 text-sm font-medium leading-6 text-slate-700">
                    Guidance only. Not legal advice. No application filing or approval guarantee.
                  </p>
                </div>
              ) : (
                <FirstChecklist values={values} result={result} />
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

function FirstChecklist({
  values,
  result,
}: {
  values: IntakeValues;
  result: ChecklistResult;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-[#0F8A6A]">Ria's first checklist</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1726]">{result.route}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Based on: {values.nationality || 'nationality not set'} · {values.currentLocation || 'location not set'} ·{' '}
        {values.purpose ? purposeLabels[values.purpose] : 'purpose not set'}
      </p>

      <ChecklistBlock title="Possible missing documents" items={result.missing} />
      <ChecklistBlock title="Risks to check" items={result.risks} warning />
      <ChecklistBlock title="Next steps" items={result.nextSteps} />

      <div className="mt-4 rounded-2xl border border-[#BFE6D2] bg-[#EEF7F1] p-4">
        <p className="text-sm font-semibold text-[#064E3B]">Expert handoff note</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">{result.handoff}</p>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-full bg-[#0F8A6A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,138,106,0.18)] transition hover:bg-[#0B6F56]"
        >
          Email me this checklist
        </button>
        <button
          type="button"
          className="rounded-full border border-[#BFE6D2] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1726] transition hover:border-[#0F8A6A]/35 hover:bg-[#F7FBF8]"
        >
          Talk to an expert
        </button>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Guidance only · Not legal advice · No approval guarantee
      </p>
    </div>
  );
}

function ChecklistBlock({ title, items, warning = false }: { title: string; items: string[]; warning?: boolean }) {
  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-[#0B1726]">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
            <span className={warning ? 'text-[#D97757]' : 'text-[#0F8A6A]'}>{warning ? '!' : '✓'}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
