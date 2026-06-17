export type LeadFormValues = {
  email: string;
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
