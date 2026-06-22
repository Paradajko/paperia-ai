import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { AppLocale } from '../i18n/locale';
import {
  validateWizardStep,
  type IntakeErrors,
  type IntakeValues,
  type Purpose,
  type WizardStep,
} from '../lib/intake';
import { saveLead } from '../lib/leads';
import { downloadChecklistPdf } from '../lib/pdf-download';
import {
  createInitialRiaMessage,
  requestRiaReply,
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

export function RiaIntakeModal({ open, onClose }: RiaIntakeModalProps) {
  const { t, i18n } = useTranslation();
  const currentLocale = (
    ['en', 'sk', 'rs', 'ua'].includes(i18n.language)
      ? i18n.language
      : 'en'
  ) as AppLocale;
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
  const stepLabels = t('wizard.stepLabels', { returnObjects: true }) as string[];

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
    const nextErrors = localizedErrors(step);
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
    const nextErrors = localizedErrors(5);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      setSubmitError('');

      const { error } = await saveLead({ ...values, locale: currentLocale });
      if (error) {
        setSubmitError(t('wizard.submitError'));
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
        setRiaError(t('wizard.submitError'));
      } finally {
        setIsRiaLoading(false);
      }
    } catch {
      setSubmitError(t('wizard.submitError'));
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
      setRiaError(t('wizard.submitError'));
    } finally {
      setIsRiaLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsPdfGenerating(true);
      setPdfError('');
      await downloadChecklistPdf({
        name: values.name,
        nationality: values.nationality,
        currentLocation: values.currentLocation,
        purpose: values.purpose,
        statusReason: values.statusReason,
        documents: values.documents,
        concern: values.concern,
        email: values.email,
      });
    } catch (error: unknown) {
      console.error('PDF generation failed:', error);
      setPdfError(t('wizard.pdfError'));
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

  const localizedErrors = (wizardStep: WizardStep): IntakeErrors => {
    const validationErrors = validateWizardStep(wizardStep, values);
    const translated: IntakeErrors = {};
    if (validationErrors.nationality) translated.nationality = t('wizard.errors.nationality');
    if (validationErrors.purpose) translated.purpose = t('wizard.errors.purpose');
    if (validationErrors.concern) translated.concern = t('wizard.errors.concern');
    if (validationErrors.email) {
      translated.email = values.email.trim()
        ? t('wizard.errors.emailInvalid')
        : t('wizard.errors.emailRequired');
    }
    return translated;
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
                  {t('wizard.guideLabel')}
                </p>
                <h2 id="ria-intake-title" className="text-lg font-semibold text-[#0B1726] sm:text-xl">
                  {submitted ? t('wizard.completeTitle') : stepLabels[step - 1]}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="min-h-12 rounded-full border border-[#DDE8DF] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#BFE6D2] hover:text-[#0B1726]"
            >
              {t('common.close')}
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
                      className="min-h-12 rounded-full border border-[#DDE8DF] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0F8A6A]/35 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t('common.back')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-h-12 rounded-full bg-[#0F8A6A] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,138,106,0.22)] transition hover:bg-[#0B6F56] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                    >
                      {step === 5
                        ? isSubmitting
                          ? t('wizard.saving')
                          : t('wizard.showChecklist')
                        : t('common.next')}
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
  const { t } = useTranslation();
  const stepLabels = t('wizard.stepLabels', { returnObjects: true }) as string[];

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
        <span className="text-[#0F8A6A]">{t('wizard.stepProgress', { step })}</span>
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
  const { t } = useTranslation();
  const descriptions = t('wizard.guideDescriptions', {
    returnObjects: true,
  }) as string[];
  const stepLabels = t('wizard.stepLabels', { returnObjects: true }) as string[];

  return (
    <aside className="flex min-h-[260px] flex-col justify-between rounded-[1.5rem] border border-[#BFE6D2] bg-[#EEF7F1] p-5">
      <div>
        <p className="text-sm font-semibold text-[#0F8A6A]">{stepLabels[step - 1]}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1726]">
          {t('wizard.guideTitle')}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{descriptions[step - 1]}</p>
      </div>
      <p className="mt-8 rounded-2xl border border-[#DDE8DF] bg-[#FFFCF6] p-4 text-sm font-medium leading-6 text-slate-700">
        {t('wizard.guideDisclaimer')}
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
  const { t } = useTranslation();
  const nationalityLabels = t('wizard.nationalities', {
    returnObjects: true,
  }) as string[];
  const locationLabels = t('wizard.locations', {
    returnObjects: true,
  }) as string[];
  const statusReasonLabels = t('wizard.statusReasons', {
    returnObjects: true,
  }) as string[];
  const documentLabels = t('wizard.documents', {
    returnObjects: true,
  }) as string[];
  const purposeLabels = t('wizard.purposes', {
    returnObjects: true,
  }) as Record<Exclude<Purpose, ''>, string>;

  if (step === 1) {
    return (
      <div>
        <h3 className="text-2xl font-semibold text-[#0B1726]">{t('wizard.destinationTitle')}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {t('wizard.destinationDescription')}
        </p>
        <label className="mt-6 block">
          <span className="text-sm font-semibold text-slate-800">{t('wizard.destinationLabel')}</span>
          <input
            value={t('wizard.destinationValue')}
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
        <h3 className="text-2xl font-semibold text-[#0B1726]">{t('wizard.situationTitle')}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {t('wizard.situationDescription')}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <SelectField
            label={t('wizard.nationalityLabel')}
            value={values.nationality}
            placeholder={t('wizard.nationalityPlaceholder')}
            options={nationalities.map((value, index) => ({
              value,
              label: nationalityLabels[index],
            }))}
            error={errors.nationality}
            onChange={(value) => updateValue('nationality', value)}
            required
          />
          <SelectField
            label={t('wizard.locationLabel')}
            value={values.currentLocation}
            placeholder={t('wizard.locationPlaceholder')}
            options={locations.map((value, index) => ({
              value,
              label: locationLabels[index],
            }))}
            onChange={(value) => updateValue('currentLocation', value)}
          />
          <SelectField
            label={t('wizard.purposeLabel')}
            value={values.purpose}
            placeholder={t('wizard.purposePlaceholder')}
            options={Object.entries(purposeLabels).map(([value, label]) => ({ value, label }))}
            error={errors.purpose}
            onChange={(value) => updateValue('purpose', value as Purpose)}
            required
          />
          <SelectField
            label={t('wizard.statusLabel')}
            value={values.statusReason}
            placeholder={t('wizard.statusPlaceholder')}
            options={statusReasons.map((value, index) => ({
              value,
              label: statusReasonLabels[index],
            }))}
            onChange={(value) => updateValue('statusReason', value)}
          />
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <fieldset>
        <legend className="text-2xl font-semibold text-[#0B1726]">{t('wizard.documentsTitle')}</legend>
        <p className="mt-2 text-sm leading-6 text-slate-600">{t('wizard.documentsDescription')}</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {documentOptions.map((documentName, index) => (
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
              {documentLabels[index]}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (step === 4) {
    return (
      <div>
        <h3 className="text-2xl font-semibold text-[#0B1726]">{t('wizard.concernTitle')}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {t('wizard.concernDescription')}
        </p>
        <label className="mt-6 block">
          <span className="text-sm font-semibold text-slate-800">{t('wizard.concernLabel')}</span>
          <textarea
            value={values.concern}
            onChange={(event) => updateValue('concern', event.target.value)}
            rows={6}
            placeholder={t('wizard.concernPlaceholder')}
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
      <h3 className="text-2xl font-semibold text-[#0B1726]">{t('wizard.emailTitle')}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {t('wizard.emailDescription')}
      </p>
      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">{t('wizard.nameLabel')}</span>
          <input
            value={values.name}
            onChange={(event) => updateValue('name', event.target.value)}
            placeholder={t('wizard.namePlaceholder')}
            className="mt-2 w-full rounded-2xl border border-[#DDE8DF] bg-white px-3 py-3 text-sm text-slate-800 shadow-sm transition focus:border-[#0F8A6A]"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">{t('wizard.emailLabel')}</span>
          <input
            type="email"
            value={values.email}
            onChange={(event) => updateValue('email', event.target.value)}
            placeholder={t('wizard.emailPlaceholder')}
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
            {t('wizard.consent')}{' '}
            <Link
              to="/privacy"
              className="font-semibold text-[#0F8A6A] underline underline-offset-4"
              onClick={(event) => event.stopPropagation()}
            >
              {t('common.privacy')}
            </Link>
          </span>
        </label>
      </div>
      <p className="mt-5 rounded-2xl border border-[#BFE6D2] bg-[#EEF7F1] p-4 text-sm font-semibold leading-6 text-[#064E3B]">
        {t('wizard.finalDisclaimer')}
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
  const { t } = useTranslation();

  return (
    <div className="rounded-[1.5rem] border border-[#BFE6D2] bg-white/82 p-5 shadow-sm">
      <RiaAvatar size="lg" className="mx-auto" />
      <p className="mt-5 text-sm font-semibold text-[#0F8A6A]">{t('wizard.completeEyebrow')}</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1726]">
        {t('wizard.completeHeading')}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {t('wizard.preparedFor', {
          person: values.name.trim() || values.email,
          nationality: values.nationality,
        })}
      </p>
      <div className="mt-5 rounded-2xl border border-[#BFE6D2] bg-[#EEF7F1] p-4">
        <p className="text-sm font-semibold text-[#064E3B]">{t('wizard.downloadTitle')}</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">
          {t('wizard.downloadDescription')}
        </p>
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isPdfGenerating}
          className="mt-4 min-h-12 w-full rounded-full bg-[#0F8A6A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,138,106,0.18)] transition hover:bg-[#0B6F56] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
        >
          {isPdfGenerating ? t('wizard.generatingPdf') : t('wizard.downloadPdf')}
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
  const { t } = useTranslation();

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
  const { t } = useTranslation();

  return (
    <div className="rounded-[1.5rem] border border-[#BFE6D2] bg-[#EEF7F1] p-4 sm:p-5">
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <RiaAvatar size="md" />
          <div>
            <p className="text-sm font-semibold text-[#0F8A6A]">{t('wizard.askRia')}</p>
            <p className="text-sm text-slate-600">{t('wizard.followUpDescription')}</p>
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
              {t('wizard.preparingResponse')}
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
            <span className="text-sm font-semibold text-slate-800">{t('wizard.followUpLabel')}</span>
            <textarea
              value={followUp}
              onChange={(event) => onFollowUpChange(event.target.value)}
              rows={3}
              placeholder={t('wizard.followUpPlaceholder')}
              className="mt-2 w-full rounded-2xl border border-[#DDE8DF] bg-white px-3 py-3 text-sm text-slate-800 shadow-sm transition focus:border-[#0F8A6A]"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading || !followUp.trim()}
            className="mt-3 min-h-12 w-full rounded-full bg-[#0F8A6A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,138,106,0.18)] transition hover:bg-[#0B6F56] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
          >
            {isLoading ? t('wizard.responding') : t('wizard.askRia')}
          </button>
        </form>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t('wizard.conversationDisclaimer')}
        </p>
      </div>
    </div>
  );
}
