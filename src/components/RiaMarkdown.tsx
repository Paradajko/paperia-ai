import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function RiaMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children: heading }) => (
          <h1 className="mb-2 mt-4 text-lg font-semibold text-ink first:mt-0">
            {heading}
          </h1>
        ),
        h2: ({ children: heading }) => (
          <h2 className="mb-2 mt-4 text-base font-semibold text-ink first:mt-0">
            {heading}
          </h2>
        ),
        h3: ({ children: heading }) => (
          <h3 className="mb-1.5 mt-3 font-semibold text-ink first:mt-0">
            {heading}
          </h3>
        ),
        p: ({ children: paragraph }) => (
          <p className="my-2 first:mt-0 last:mb-0">{paragraph}</p>
        ),
        ul: ({ children: items }) => (
          <ul className="my-2 list-disc space-y-1 pl-5">{items}</ul>
        ),
        ol: ({ children: items }) => (
          <ol className="my-2 list-decimal space-y-1 pl-5">{items}</ol>
        ),
        strong: ({ children: strongText }) => (
          <strong className="font-semibold text-ink">{strongText}</strong>
        ),
        a: ({ href, children: linkText }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#0F8A6A] underline underline-offset-4"
          >
            {linkText}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
