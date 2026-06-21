export type EmailTemplateKey =
  | 'welcome'
  | 'education-day2'
  | 'checklist-reminder-day5'
  | 'case-study-day8'
  | 'agency-handoff-day14';

export type EmailTemplateContext = {
  email: string;
  name?: string | null;
  nationality?: string | null;
  destinationCountry?: string | null;
  residenceType?: string | null;
  unsubscribeUrl: string;
  locale?: 'en' | 'sk' | 'rs' | 'ua';
};

export type SequenceEmail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
  headers: Record<string, string>;
};

type TemplateBody = {
  subject: string;
  heading: string;
  text: string;
  html: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

const RIADENCE_URL = 'https://riadence.com';
const RIA_AVATAR_URL = `${RIADENCE_URL}/ria-guide-half.png`;
const DISCLAIMER =
  'I am not a lawyer. Riadence provides general information, not legal advice. Verify important details with an official Slovak source or a licensed professional.';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function plain(value: string | null | undefined, fallback: string): string {
  const normalized = value?.trim().replace(/[<>]/g, '');
  return normalized || fallback;
}

function welcome(context: EmailTemplateContext): TemplateBody {
  const locale = context.locale ?? 'en';
  const greeting = plain(context.name, 'there');
  const details = [
    context.nationality
      ? `Nationality: ${plain(context.nationality, 'Not specified')}`
      : null,
    context.destinationCountry
      ? `Destination country: ${plain(context.destinationCountry, 'Slovakia')}`
      : null,
    context.residenceType
      ? `Residence type: ${plain(context.residenceType, 'Not specified')}`
      : null,
  ].filter((item): item is string => Boolean(item));
  const textDetails = details.length
    ? `\n\nHere is what we have so far:\n- ${details.join('\n- ')}`
    : '';
  const htmlDetails = details.length
    ? `<ul style="margin:18px 0;padding-left:20px;color:#334155;line-height:1.8;">${details
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join('')}</ul>`
    : '';

  if (locale === 'sk') {
    return {
      subject: 'Váš checklist pre pobyt na Slovensku je pripravený',
      heading: 'Váš checklist pre Slovensko je pripravený',
      text: `Dobrý deň, ${greeting},

Ria uložila Vaše odpovede a pripravila východiskový bod pre pobyt na Slovensku.${textDetails}

V Riadence môžete:
- skontrolovať pravdepodobný typ pobytu a plán dokumentov
- stiahnuť si personalizovaný PDF checklist
- položiť Rii praktické doplňujúce otázky`,
      html: `<p>Dobrý deň, ${escapeHtml(greeting)},</p><p>Ria uložila Vaše odpovede a pripravila východiskový bod pre pobyt na Slovensku.</p>${htmlDetails}<p><strong>Čo môžete urobiť ďalej</strong></p><ul><li>Skontrolovať typ pobytu a plán dokumentov</li><li>Stiahnuť personalizovaný PDF checklist</li><li>Položiť Rii praktické otázky</li></ul>`,
      ctaLabel: 'Otvoriť Riadence',
      ctaUrl: RIADENCE_URL,
    };
  }
  if (locale === 'rs') {
    return {
      subject: 'Vaša kontrolna lista za boravak u Slovačkoj je spremna',
      heading: 'Vaša kontrolna lista za Slovačku je spremna',
      text: `Poštovani/a ${greeting},

Ria je sačuvala Vaše odgovore i pripremila početnu tačku za boravak u Slovačkoj.${textDetails}

U Riadence-u možete:
- pregledati verovatan osnov boravka i plan dokumenata
- preuzeti personalizovanu PDF kontrolnu listu
- postaviti Rii praktična dodatna pitanja`,
      html: `<p>Poštovani/a ${escapeHtml(greeting)},</p><p>Ria je sačuvala Vaše odgovore i pripremila početnu tačku za boravak u Slovačkoj.</p>${htmlDetails}<p><strong>Sledeći koraci</strong></p><ul><li>Pregledajte osnov boravka i plan dokumenata</li><li>Preuzmite personalizovanu PDF kontrolnu listu</li><li>Postavite Rii praktična pitanja</li></ul>`,
      ctaLabel: 'Otvorite Riadence',
      ctaUrl: RIADENCE_URL,
    };
  }
  if (locale === 'ua') {
    return {
      subject: 'Ваш чекліст для проживання у Словаччині готовий',
      heading: 'Ваш чекліст для Словаччини готовий',
      text: `Вітаємо, ${greeting}!

Ria зберегла Ваші відповіді та підготувала початковий план для проживання у Словаччині.${textDetails}

У Riadence Ви можете:
- переглянути ймовірну підставу проживання та план документів
- завантажити персоналізований PDF-чекліст
- поставити Ria практичні додаткові запитання`,
      html: `<p>Вітаємо, ${escapeHtml(greeting)}!</p><p>Ria зберегла Ваші відповіді та підготувала початковий план для проживання у Словаччині.</p>${htmlDetails}<p><strong>Наступні кроки</strong></p><ul><li>Перегляньте підставу проживання та план документів</li><li>Завантажте персоналізований PDF-чекліст</li><li>Поставте Ria практичні запитання</li></ul>`,
      ctaLabel: 'Відкрити Riadence',
      ctaUrl: RIADENCE_URL,
    };
  }

  return {
    subject: 'Your Slovakia residence checklist is ready inside',
    heading: 'Your Slovakia checklist is ready',
    text: `Hi ${greeting},

Ria has saved your answers for your Slovakia residence checklist.${textDetails}

Inside Riadence, you can:
- Review your likely residence route and document plan
- Download your personalized PDF checklist
- Ask Ria practical follow-up questions`,
    html: `<p>Hi ${escapeHtml(greeting)},</p>
      <p>Ria has saved your answers and prepared the starting point for your Slovakia residence checklist.</p>
      ${htmlDetails}
      <p><strong>What you can do next</strong></p>
      <ul><li>Review your likely residence route and document plan</li><li>Download your personalized PDF checklist</li><li>Ask Ria practical follow-up questions</li></ul>`,
    ctaLabel: 'Open Riadence',
    ctaUrl: RIADENCE_URL,
  };
}

function education(context: EmailTemplateContext): TemplateBody {
  return {
    subject:
      '3 things most applicants forget about Slovakia residence permits',
    heading: 'Three details worth checking early',
    text: `Hi ${plain(context.name, 'there')},

1. Translation requirements: foreign documents usually need an official translation into Slovak. Confirm who may prepare it and whether the original must be attached.
2. Apostille or legalization: documents issued by non-Slovak authorities may need authentication. The rule depends on the issuing country and document type.
3. Health insurance: proof connected with residence and arranging actual health insurance can be separate steps. Confirm both timing and coverage.

Practical tip: make a document list with issue date, translation status, authentication status, and the official source you checked.`,
    html: `<p>Hi ${escapeHtml(plain(context.name, 'there'))},</p>
      <ol><li><strong>Translation requirements.</strong> Foreign documents usually need an official Slovak translation.</li><li><strong>Apostille or legalization.</strong> Foreign public documents may need authentication depending on country and type.</li><li><strong>Health insurance.</strong> Residence proof and arranging actual coverage can be separate steps.</li></ol>
      <p>Make a document list with issue date, translation status, authentication status, and the official source you checked.</p>`,
  };
}

function reminder(context: EmailTemplateContext): TemplateBody {
  return {
    subject:
      "Did you download your personalized PDF? Here's what to do next",
    heading: 'Turn your checklist into a working plan',
    text: `Hi ${plain(context.name, 'there')},

Your personalized PDF checklist is available through Riadence. Download it, mark what you already have, and verify the oldest or hardest document first.

Ria chat is available for practical follow-up questions while you review the checklist.`,
    html: `<p>Hi ${escapeHtml(plain(context.name, 'there'))},</p><p>Your personalized PDF checklist is available through Riadence. Download it, mark what you already have, and verify the oldest or hardest document first.</p><p>Ria chat remains available for practical follow-up questions.</p>`,
    ctaLabel: 'Open your checklist',
    ctaUrl: RIADENCE_URL,
  };
}

function caseStudy(context: EmailTemplateContext): TemplateBody {
  const country = plain(context.nationality, 'a non-EU country');
  return {
    subject: `Real example: How Maya from ${country} prepared for a Slovakia residence permit`,
    heading: 'An illustrative preparation example',
    text: `Hi ${plain(context.name, 'there')},

This is an illustrative example, not a verified customer testimonial.

Maya from ${country} first listed every required document, then checked which records needed a Slovak translation or apostille. She started the slowest documents first, kept copies of official instructions, and verified the final list shortly before filing.

The useful lesson is the order: route, official source, document age, authentication, translation, then appointment preparation.`,
    html: `<p>Hi ${escapeHtml(plain(context.name, 'there'))},</p><p><strong>This is an illustrative example, not a verified customer testimonial.</strong></p><p>Maya from ${escapeHtml(country)} first listed every required document, checked translation and apostille requirements, started slow documents first, and verified the list again before filing.</p><p>The useful order is: route, official source, document age, authentication, translation, then appointment preparation.</p>`,
  };
}

function handoff(context: EmailTemplateContext): TemplateBody {
  return {
    subject:
      "When Riadence isn't enough: How to find a trusted Slovakia lawyer",
    heading: 'Know when to ask for licensed help',
    text: `Hi ${plain(context.name, 'there')},

Riadence is free general guidance. A lawyer or licensed professional charges separately for advice, representation, filings, appeals, or complex case strategy.

Professional help is especially important for refusals, appeals, deportation risk, asylum, unclear family status, criminal-history issues, or conflicting official instructions.

Before hiring someone, verify their identity, qualifications, written scope, total fee, refund terms, and who will actually handle the case.

We may earn a commission if you use a partner.`,
    html: `<p>Hi ${escapeHtml(plain(context.name, 'there'))},</p><p>Riadence is free general guidance. A lawyer or licensed professional charges separately for advice, representation, filings, appeals, or complex strategy.</p><p>Verify identity, qualifications, written scope, total fee, refund terms, and who will handle the case.</p><p><strong>We may earn a commission if you use a partner.</strong></p>`,
    ctaLabel: 'Ask Riadence about professional support',
    ctaUrl: 'mailto:hello@riadence.com',
  };
}

export const EMAIL_TEMPLATES: Record<
  EmailTemplateKey,
  (context: EmailTemplateContext) => TemplateBody
> = {
  welcome,
  'education-day2': education,
  'checklist-reminder-day5': reminder,
  'case-study-day8': caseStudy,
  'agency-handoff-day14': handoff,
};

export function buildSequenceEmail(
  key: EmailTemplateKey,
  context: EmailTemplateContext,
): SequenceEmail {
  const body = EMAIL_TEMPLATES[key](context);
  const ctaText =
    body.ctaLabel && body.ctaUrl
      ? `\n\n${body.ctaLabel}: ${body.ctaUrl}`
      : '';
  const ctaHtml =
    body.ctaLabel && body.ctaUrl
      ? `<p style="margin:24px 0;text-align:center;"><a href="${escapeHtml(body.ctaUrl)}" style="display:inline-block;border-radius:999px;background:#0F8A6A;padding:13px 24px;color:#fff;font-weight:700;text-decoration:none;">${escapeHtml(body.ctaLabel)}</a></p>`
      : '';

  return {
    from: 'Riadence <hello@riadence.com>',
    to: context.email.trim().toLowerCase(),
    replyTo: 'hello@riadence.com',
    subject: body.subject,
    text: `${body.text}${ctaText}

${DISCLAIMER}
Privacy Policy: ${RIADENCE_URL}/privacy
Terms of Service: ${RIADENCE_URL}/terms
Unsubscribe: ${context.unsubscribeUrl}`,
    html: `<!doctype html><html lang="en"><body style="margin:0;background:#F4F7F5;font-family:Inter,Arial,sans-serif;color:#0B1726;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 12px;"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;border:1px solid #DDE8DF;border-radius:24px;background:#FFFCF6;"><tr><td align="center" style="padding:30px 28px 20px;background:#EEF7F1;"><img src="${RIA_AVATAR_URL}" width="96" height="96" alt="Ria, your residence guide for Slovakia" style="display:block;border:2px solid #BFE6D2;border-radius:50%;object-fit:cover;object-position:top;"><p style="color:#0F8A6A;font-size:12px;font-weight:700;text-transform:uppercase;">Riadence · guided by Ria</p><h1 style="font-size:27px;line-height:1.2;">${escapeHtml(body.heading)}</h1></td></tr><tr><td style="padding:26px 30px 32px;color:#475569;font-size:15px;line-height:1.7;">${body.html}${ctaHtml}<p style="margin-top:24px;border-top:1px solid #DDE8DF;padding-top:18px;color:#64748B;font-size:12px;">${escapeHtml(DISCLAIMER)}</p><p style="color:#64748B;font-size:12px;"><a href="${RIADENCE_URL}/privacy">Privacy Policy</a> · <a href="${RIADENCE_URL}/terms">Terms of Service</a> · <a href="${escapeHtml(context.unsubscribeUrl)}">Unsubscribe</a></p></td></tr></table></td></tr></table></body></html>`,
    headers: {
      'List-Unsubscribe': `<${context.unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
}
