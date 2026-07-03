import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

Chart.register(...registerables);

// LLM output often uses single newlines between ideas, which standard Markdown
// collapses into one run-on paragraph. Turn those into real paragraph breaks
// (but leave list items, headings, tables and existing blank lines alone).
function normalizeMarkdown(text) {
  if (!text) return text;
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/([^\n])\n(?!\n|[-*+]\s|\d+\.\s|#{1,6}\s|\|)/g, "$1\n\n");
}

const markdownComponents = {
  p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
  ul: ({ node, ...props }) => <ul className="mb-2 last:mb-0 ml-4 list-disc space-y-0.5" {...props} />,
  ol: ({ node, ...props }) => <ol className="mb-2 last:mb-0 ml-4 list-decimal space-y-0.5" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
  a: ({ node, ...props }) => (
    <a className="text-brand-600 dark:text-brand-400 underline underline-offset-2 hover:text-brand-700" target="_blank" rel="noreferrer" {...props} />
  ),
  h1: ({ node, ...props }) => <h1 className="text-base font-bold mt-1 mb-1.5" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-sm font-bold mt-1 mb-1.5" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-sm font-semibold mt-1 mb-1" {...props} />,
  pre: ({ node, ...props }) => (
    <pre className="my-2 p-2.5 rounded-lg bg-ink-900 text-ink-100 text-[0.85em] font-mono overflow-x-auto" {...props} />
  ),
  code: ({ node, className, ...props }) =>
    className
      ? <code className={`${className} font-mono`} {...props} />
      : <code className="px-1 py-0.5 rounded bg-ink-100 dark:bg-ink-700 text-[0.85em] font-mono" {...props} />,
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-2">
      <table className="w-full text-xs border-collapse" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => <th className="border border-ink-200 dark:border-ink-600 px-2 py-1 text-left bg-ink-50 dark:bg-ink-700 font-semibold" {...props} />,
  td: ({ node, ...props }) => <td className="border border-ink-200 dark:border-ink-600 px-2 py-1" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-2 border-brand-400 pl-3 italic text-ink-500 dark:text-ink-400 my-2" {...props} />
  ),
  hr: ({ node, ...props }) => <hr className="my-3 border-ink-200 dark:border-ink-700" {...props} />,
  em: ({ node, ...props }) => <em className="italic" {...props} />,
};

function InlineChart({ chart }) {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chart || !canvasRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(canvasRef.current.getContext("2d"), {
      type: chart.type || "line",
      data: chart.data,
      options: { ...chart.options, responsive: true, maintainAspectRatio: false },
    });
    return () => chartInstance.current?.destroy();
  }, [chart]);

  if (!chart) return null;
  return (
    <div className="mt-2.5 bg-white dark:bg-ink-800 rounded-xl border border-ink-100 dark:border-ink-700 shadow-soft p-3 h-48">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default function ChatMessage({ message }) {
  const { role: sender, content, chart, timestamp } = message;
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-5 animate-fade-in`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-black ring-2 ring-white dark:ring-ink-900 flex items-center justify-center text-white mr-2.5 shrink-0 mt-0.5 p-1.5 shadow-soft">
          <img src="/logo.png" alt="" className="w-full h-full object-contain" />
        </div>
      )}
      <div className={`max-w-[80%] min-w-0 ${isUser ? "order-first" : ""}`}>
        {!isUser && (
          <div className="text-xs font-semibold text-ink-500 dark:text-ink-400 mb-1 ml-0.5">Jalmitra</div>
        )}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-brand-600 text-white rounded-br-md shadow-soft whitespace-pre-wrap"
              : "bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 shadow-soft border border-ink-100 dark:border-ink-700 rounded-bl-md"
          }`}
        >
          {isUser ? content : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {normalizeMarkdown(content)}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && chart && <InlineChart chart={chart} />}

        {!isUser && (
          <div className="text-xs text-ink-400 mt-2 ml-0.5">{timestamp}</div>
        )}
        {isUser && (
          <div className="text-xs text-ink-400 mt-1 mr-0.5 text-right">{timestamp}</div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-ink-700 dark:bg-ink-600 ring-2 ring-white dark:ring-ink-900 flex items-center justify-center text-white ml-2.5 shrink-0 mt-0.5 shadow-soft">
          <User size={15} />
        </div>
      )}
    </div>
  );
}
