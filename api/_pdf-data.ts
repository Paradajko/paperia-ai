// Shared server-side data model for PDF rendering and request validation.
export type ChecklistApplicantData = {
  name: string;
  email: string;
  nationality: string;
  currentLocation: string;
  purpose: string;
  statusReason: string;
  documents: string[];
  concern: string;
};

export type ChecklistResource = {
  label: string;
  url: string;
};

export type ChecklistContent = {
  preparedFor: string;
  routeTitle: string;
  routeSummary: string;
  documentsNeeded: string[];
  timeline: string[];
  officialResources: ChecklistResource[];
  emergencyContacts: string[];
  verifiedDate: string;
  disclaimer: string;
};

const routeContent: Record<
  string,
  {
    title: string;
    summary: string;
    documents: string[];
    timeline: string[];
  }
> = {
  employment: {
    title: 'Temporary residence for employment',
    summary:
      'Coordinate the residence route with your Slovak employer and confirm which employer-side documents must be prepared before filing.',
    documents: [
      'Passport',
      'Employment contract or promise of employment',
      'Criminal record extract',
      'Accommodation proof',
      'Proof of financial means',
      'Health insurance proof',
      'Passport photos',
    ],
    timeline: [
      'Confirm the job offer, role, and employer-side paperwork.',
      'Order criminal records early and check translation, apostille, or legalization rules.',
      'Prepare accommodation and financial evidence.',
      'Confirm the correct embassy or Foreign Police appointment route.',
      'Bring originals, certified translations, and current supporting documents to the appointment.',
    ],
  },
  study: {
    title: 'Temporary residence for study',
    summary:
      'Use your Slovak school admission as the core purpose document and confirm the school start date, accommodation, and financial evidence.',
    documents: [
      'Passport',
      'School acceptance letter',
      'Criminal record extract',
      'Accommodation proof',
      'Proof of financial means',
      'Health insurance proof',
      'Passport photos',
    ],
    timeline: [
      'Confirm that the school admission document matches current filing requirements.',
      'Order criminal records and certified translations early.',
      'Prepare accommodation, financial means, and insurance evidence.',
      'Confirm whether you file through a Slovak embassy or Foreign Police.',
      'Recheck document validity immediately before the appointment.',
    ],
  },
  family: {
    title: 'Temporary residence for family reunification',
    summary:
      'Build the application around the family relationship evidence and the Slovak status, housing, and support documents of the family member you are joining.',
    documents: [
      'Passport',
      'Family relationship document',
      'Sponsor residence or citizenship proof',
      'Criminal record extract',
      'Accommodation proof',
      'Proof of financial means',
      'Health insurance proof',
      'Passport photos',
    ],
    timeline: [
      'Collect marriage, birth, or other relationship records.',
      'Check apostille, legalization, and Slovak translation requirements.',
      'Prepare sponsor-side residence, housing, and financial documents.',
      'Confirm the correct filing location and appointment availability.',
      'Ask a licensed professional for review if there was a prior refusal or disputed relationship evidence.',
    ],
  },
  business: {
    title: 'Temporary residence for business or self-employment',
    summary:
      'Document a credible Slovak business purpose, the planned structure, available funds, and the steps already completed.',
    documents: [
      'Passport',
      'Business plan or trade documents',
      'Criminal record extract',
      'Accommodation proof',
      'Proof of financial means',
      'Health insurance proof',
      'Passport photos',
    ],
    timeline: [
      'Clarify the Slovak company or trade structure.',
      'Prepare the business plan and evidence of available funds.',
      'Order criminal records and certified translations.',
      'Confirm accommodation and filing-location requirements.',
      'Use professional advice if the ownership structure or business purpose is complex.',
    ],
  },
  other: {
    title: 'Residence route needs clarification',
    summary:
      'Your purpose does not yet map cleanly to one standard route. Confirm the legal basis for staying in Slovakia before paying for documents or booking an appointment.',
    documents: [
      'Passport',
      'Evidence of your purpose in Slovakia',
      'Criminal record extract',
      'Accommodation proof',
      'Proof of financial means',
      'Health insurance proof',
      'Passport photos',
    ],
    timeline: [
      'Write down the primary reason and intended length of stay.',
      'Compare that reason with the official residence categories.',
      'Collect basic identity, accommodation, and financial evidence.',
      'Confirm the route with an official source.',
      'Use a licensed immigration lawyer if the legal basis remains unclear.',
    ],
  },
};

const officialResources: ChecklistResource[] = [
  {
    label: 'Slovak Foreign Police — residence of a foreign national',
    url: 'https://www.minv.sk/?pobyt-cudzinca',
  },
  {
    label: 'Slov-Lex — Act No. 404/2011 on Residence of Foreigners',
    url: 'https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/2011/404/',
  },
  {
    label: 'Ministry of Foreign and European Affairs — Slovak diplomatic missions',
    url: 'https://www.mzv.sk/en/web/en/ministry/slovak-diplomatic-missions/diplomatic-missions',
  },
];

export function buildChecklistContent(
  applicantData: ChecklistApplicantData,
  verifiedAt = new Date(),
): ChecklistContent {
  const route = routeContent[applicantData.purpose] ?? routeContent.other;
  const existingDocuments = new Set(
    applicantData.documents.map((document) => document.toLocaleLowerCase()),
  );

  return {
    preparedFor: applicantData.name.trim() || applicantData.email,
    routeTitle: route.title,
    routeSummary: route.summary,
    documentsNeeded: route.documents.filter(
      (document) => !existingDocuments.has(document.toLocaleLowerCase()),
    ),
    timeline: route.timeline,
    officialResources,
    emergencyContacts: [
      '112 — EU emergency number',
      '158 — Police',
      '155 — Emergency medical service',
      '150 — Fire and rescue service',
    ],
    verifiedDate: verifiedAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }),
    disclaimer:
      'I am not a lawyer. I am an AI assistant, not a lawyer. This checklist provides general information, not legal advice. Verify every requirement with an official Slovak source or a licensed immigration lawyer. Privacy Policy: https://riadence.com/privacy. Terms of Service: https://riadence.com/terms.',
  };
}
