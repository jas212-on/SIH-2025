import { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function StatusIndicator({ className = "text-white/80" }) {
  const [status, setStatus] = useState("checking"); // checking | online | offline

  useEffect(() => {
    let cancelled = false;
    api.health()
      .then(() => { if (!cancelled) setStatus("online"); })
      .catch(() => { if (!cancelled) setStatus("offline"); });
    return () => { cancelled = true; };
  }, []);

  const colors = { checking: "bg-amber-400", online: "bg-emerald-400", offline: "bg-rose-400" };
  const labels = { checking: "Connecting", online: "API Online", offline: "API Offline" };

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${className}`}>
      <span className="relative flex w-2 h-2">
        {status !== "offline" && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${colors[status]} ${status === "checking" ? "animate-ping" : "opacity-0"}`} />
        )}
        <span className={`relative inline-flex w-2 h-2 rounded-full ${colors[status]}`} />
      </span>
      {labels[status]}
    </div>
  );
}
