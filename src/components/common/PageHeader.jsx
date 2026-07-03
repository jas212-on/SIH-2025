import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function PageHeader({ icon: Icon, iconClassName = "text-brand-600", title, subtitle }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="min-w-0">
        <button
          onClick={() => navigate("/chat")}
          title="Back to chat"
          className="flex items-center gap-1.5 text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition mb-2"
        >
          <ArrowLeft size={13} />
          Back to chat
        </button>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-ink-800 dark:text-ink-100">
          {Icon && <Icon className={iconClassName} />} {title}
        </h1>
        {subtitle && <p className="text-ink-500 dark:text-ink-400 mt-1">{subtitle}</p>}
      </div>
      <LanguageSwitcher className="text-ink-600 dark:text-ink-300 shrink-0 mt-6" />
    </div>
  );
}
