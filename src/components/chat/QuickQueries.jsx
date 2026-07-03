import { useTranslation } from "react-i18next";
import { Sparkles, ArrowUpRight } from "lucide-react";

const QUERY_KEYS = ["q1", "q2", "q3"];

export default function QuickQueries({ onSelect, visible }) {
  const { t } = useTranslation();
  if (!visible) return null;
  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-3">
        <Sparkles size={13} className="text-brand-500" />
        {t('tryAsking')}
      </div>
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5 text-left">
        {QUERY_KEYS.map((key) => {
          const q = t(`quickQueries.${key}`);
          return (
            <button
              key={key}
              onClick={() => onSelect(q)}
              className="group flex-1 min-w-0 flex items-start justify-between gap-2 px-4 py-3 text-sm font-medium rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-200 shadow-soft hover:border-brand-400 hover:shadow-card hover:-translate-y-0.5 transition-all"
            >
              <span className="leading-snug">{q}</span>
              <ArrowUpRight
                size={15}
                className="shrink-0 mt-0.5 text-ink-300 dark:text-ink-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
