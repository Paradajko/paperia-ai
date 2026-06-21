import type { ChecklistApplicantData } from '../../api/_pdf-data.js';

type LinkLike = {
  href: string;
  download: string;
  click(): void;
  remove(): void;
};

type DownloadDependencies = {
  fetchImpl: typeof fetch;
  createObjectUrl(blob: Blob): string;
  revokeObjectUrl(url: string): void;
  createLink(): LinkLike;
  appendLink(link: LinkLike): void;
  schedule(callback: () => void, delay: number): void;
};

function defaultDependencies(): DownloadDependencies {
  return {
    fetchImpl: fetch,
    createObjectUrl: (blob) => URL.createObjectURL(blob),
    revokeObjectUrl: (url) => URL.revokeObjectURL(url),
    createLink: () => document.createElement('a'),
    appendLink: (link) => document.body.appendChild(link as HTMLAnchorElement),
    schedule: (callback, delay) => {
      window.setTimeout(callback, delay);
    },
  };
}

export async function downloadChecklistPdf(
  applicantData: ChecklistApplicantData,
  dependencies: Partial<DownloadDependencies> = {},
): Promise<void> {
  const deps = { ...defaultDependencies(), ...dependencies };
  const response = await deps.fetchImpl('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicantData),
  });
  if (!response.ok) {
    throw new Error('PDF generation failed');
  }

  const blob = await response.blob();
  const url = deps.createObjectUrl(blob);
  const link = deps.createLink();
  const nationalitySlug = applicantData.nationality
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  link.href = url;
  link.download = `paperia-slovakia-checklist-${nationalitySlug || 'applicant'}.pdf`;
  deps.appendLink(link);
  link.click();
  link.remove();
  deps.schedule(() => deps.revokeObjectUrl(url), 1_000);
}
