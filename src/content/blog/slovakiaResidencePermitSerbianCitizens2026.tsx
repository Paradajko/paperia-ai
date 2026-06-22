import type { ReactNode } from 'react';

import articleSource from './slovakia-residence-permit-serbian-citizens-2026.mdx?raw';

function renderInline(text: string): ReactNode[] {
  const tokens =
    text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);

  return tokens.map((token, index) => {
    const bold = token.match(/^\*\*(.+)\*\*$/);
    if (bold) {
      return <strong key={`${token}-${index}`}>{bold[1]}</strong>;
    }

    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a
          key={`${token}-${index}`}
          href={link[2]}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-harbor underline decoration-[#A7F3D0] underline-offset-4"
        >
          {link[1]}
        </a>
      );
    }

    return token;
  });
}

export function SlovakiaResidencePermitSerbianCitizens2026() {
  const body = articleSource
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/^# .+\n+/, '');
  const blocks = body.split(/\n{2,}/).filter(Boolean);

  return (
    <div>
      {blocks.map((block, index) => {
        if (block.startsWith('## ')) {
          return (
            <h2
              key={`${block}-${index}`}
              className="mt-9 text-2xl font-semibold tracking-tight text-ink"
            >
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith('### ')) {
          return (
            <h3
              key={`${block}-${index}`}
              className="mt-7 text-xl font-semibold tracking-tight text-ink"
            >
              {block.slice(4)}
            </h3>
          );
        }

        const isDisclaimer = block.startsWith('**I am not a lawyer.');
        return isDisclaimer ? (
          <aside
            key={`${block}-${index}`}
            className="mt-10 rounded-3xl border border-[#BFE6D2] bg-[#EEF7F1] p-5 text-sm font-medium leading-6 text-slate-700"
          >
            {renderInline(block)}
          </aside>
        ) : (
          <p
            key={`${block}-${index}`}
            className="mt-4 text-base leading-7 text-slate-700"
          >
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}
