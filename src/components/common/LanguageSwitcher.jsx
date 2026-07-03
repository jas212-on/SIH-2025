import { useEffect, useRef, useState } from "react";
import { Languages, Check, ChevronDown } from "lucide-react";
import { LANGUAGES } from "../../config/constants";
import { useLanguage } from "../../hooks/useLanguage";

export default function LanguageSwitcher({ className = "" }) {
  const [language, setLanguage] = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function onEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const active = LANGUAGES.find((l) => l.code === language);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Change interface language"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-current text-sm font-medium rounded-full pl-3 pr-2.5 py-1.5 outline-none transition cursor-pointer"
      >
        <Languages size={14} className="opacity-70" />
        <span>{active?.name}</span>
        <ChevronDown size={13} className={`opacity-60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-44 py-1.5 rounded-xl bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 shadow-card z-50 animate-slide-up"
        >
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === language;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 text-sm text-left transition ${
                  isActive
                    ? "text-brand-700 dark:text-brand-400 font-semibold bg-brand-50 dark:bg-brand-900/20"
                    : "text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-700/50"
                }`}
              >
                {lang.name}
                {isActive && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
