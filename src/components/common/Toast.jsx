import { useState, useCallback, createContext, useContext } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  info: Info,
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
};

const STYLES = {
  info:    "bg-brand-600",
  success: "bg-emerald-600",
  error:   "bg-rose-600",
  warning: "bg-amber-500",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-xs">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || ICONS.info;
          return (
            <div
              key={t.id}
              className={`${STYLES[t.type] || STYLES.info} text-white px-4 py-3 rounded-xl shadow-card flex items-start gap-2.5 animate-slide-up`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0 mt-0.5" size={18} />
              <span className="flex-1 text-sm leading-snug">{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="text-white/70 hover:text-white shrink-0">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
