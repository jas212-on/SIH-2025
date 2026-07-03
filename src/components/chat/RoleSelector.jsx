import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { USER_ROLES } from "../../config/constants";
import { ROLE_ICONS } from "../../config/icons";

export default function RoleSelector({ selected, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-2">
      {USER_ROLES.map((r) => {
        const Icon = ROLE_ICONS[r.icon];
        const active = selected === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onChange(r.id)}
            title={t(`roles.${r.id}.focus`)}
            className={`relative flex flex-col items-start gap-1.5 p-3 rounded-xl text-left border transition ${
              active
                ? "bg-brand-600 border-brand-600 text-white shadow-soft"
                : "bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-300 border-ink-200 dark:border-ink-700 hover:border-brand-400 hover:-translate-y-0.5"
            }`}
          >
            {active && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                <Check size={10} className="text-white" strokeWidth={3} />
              </span>
            )}
            <Icon size={18} className={active ? "text-white" : "text-brand-600 dark:text-brand-400"} />
            <span className="text-xs font-semibold">{t(`roles.${r.id}.title`)}</span>
          </button>
        );
      })}
    </div>
  );
}
