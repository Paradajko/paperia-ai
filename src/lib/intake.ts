export type Purpose = '' | 'employment' | 'study' | 'family' | 'business' | 'other';

export type IntakeValues = {
  name: string;
  nationality: string;
  currentLocation: string;
  purpose: Purpose;
  statusReason: string;
  documents: string[];
  concern: string;
  email: string;
};

export type IntakeErrorKey = 'nationality' | 'purpose' | 'concern' | 'email';
export type IntakeErrors = Partial<Record<IntakeErrorKey, string>>;
export type WizardStep = 1 | 2 | 3 | 4 | 5;

export function validateWizardStep(
  step: WizardStep,
  values: IntakeValues,
): IntakeErrors {
  const errors: IntakeErrors = {};

  if (step === 2) {
    if (!values.nationality) {
      errors.nationality = 'Choose your nationality.';
    }
    if (!values.purpose) {
      errors.purpose = 'Choose your purpose of stay.';
    }
  }

  if (step === 4 && !values.concern.trim()) {
    errors.concern = 'Tell Ria what worries you most.';
  }

  if (step === 5) {
    if (!values.email.trim()) {
      errors.email = 'Enter your email.';
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      errors.email = 'Enter a valid email address.';
    }
  }

  return errors;
}
