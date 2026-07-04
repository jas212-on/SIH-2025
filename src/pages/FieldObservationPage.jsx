import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Droplets, MessageSquare, Send, Users, ShieldAlert } from "lucide-react";
import { api } from "../services/api";
import { useStates, useDistricts } from "../hooks/useReferenceData";
import { useToast } from "../components/common/Toast";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import WaveDivider from "../components/home/WaveDivider";

export default function FieldObservationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState("KERALA");
  const [district, setDistrict] = useState("");
  const { states } = useStates();
  const { districts } = useDistricts(state);
  const [wellDepthM, setWellDepthM] = useState("");
  const [note, setNote] = useState("");
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function loadObservations() {
    try {
      const data = await api.listObservations(state, district || undefined);
      setObservations(data.observations || []);
    } catch {}
  }

  useEffect(() => { loadObservations(); }, [state, district]); // eslint-disable-line react-hooks/exhaustive-deps

  async function submit() {
    const depth = parseFloat(wellDepthM);
    if (!depth || depth <= 0) { toast("Enter a valid well depth in meters", "warning"); return; }
    setLoading(true);
    try {
      await api.submitObservation({ state, district: district || undefined, wellDepthM: depth, note });
      toast("Thanks! Your reading has been submitted as community data.", "success");
      setWellDepthM(""); setNote("");
      loadObservations();
    } catch (e) {
      toast(e.message || "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <header className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 shadow-card z-10">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/chat")}
              title={t("backToChat")}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => navigate("/")}
              title="Jalmitra home"
              className="flex items-center gap-3 min-w-0 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-black ring-1 ring-white/10 flex items-center justify-center shrink-0 p-1.5">
                <img src="/logo.png" alt="Jalmitra" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-lg sm:text-xl font-bold text-white leading-tight tracking-tight truncate">
                  {t('pages.fieldData.title')}
                </h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">{t('pages.fieldData.subtitle')}</p>
              </div>
            </button>
          </div>
          <LanguageSwitcher className="text-white shrink-0" />
        </div>
        <WaveDivider position="bottom" fillClassName="fill-ink-50 dark:fill-ink-950" duration={26} className="!h-3 opacity-60" />
      </header>

      {/* Toolbar */}
      <div className="bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 px-6 sm:px-10 lg:px-14 py-3">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-[11px] font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide block mb-1">State</label>
            <select value={state} onChange={(e) => { setState(e.target.value); setDistrict(""); }}
              className="px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              {states.map((s) => <option key={s} value={s}>{s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide block mb-1">District</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)}
              className="px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Not sure / whole state</option>
              {districts.map((d) => <option key={d} value={d}>{d.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-14 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: submission form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-5">
              <h3 className="font-semibold text-lg text-ink-800 dark:text-ink-100 mb-4">Submit a Reading</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-ink-500 dark:text-ink-400 mb-1">
                    <Droplets size={13} /> Well depth (meters)
                  </label>
                  <input type="number" step="0.1" value={wellDepthM} onChange={(e) => setWellDepthM(e.target.value)}
                    placeholder="e.g. 12.5"
                    className="w-full px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="bg-ink-50 dark:bg-ink-700/40 rounded-xl p-3 text-xs text-ink-500 dark:text-ink-400">
                    Reporting for <span className="font-semibold text-ink-700 dark:text-ink-300">{district ? `${district.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}, ` : ""}{state.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-1.5 text-xs font-medium text-ink-500 dark:text-ink-400 mb-1">
                  <MessageSquare size={13} /> Note (optional)
                </label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
                  placeholder="e.g. well is drying up faster than last year"
                  className="w-full px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>

              <button onClick={submit} disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-full shadow-soft transition text-sm">
                <Send size={14} />
                {loading ? "Submitting..." : "Submit Reading"}
              </button>
            </div>

            <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4">
              <ShieldAlert size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                Community-reported data is clearly labeled as unverified and never mixed silently with official CGWB data.
              </p>
            </div>
          </div>

          {/* Right: recent community readings */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
              <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400 mb-3">
                <Users size={13} /> Recent Community Readings — {state.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
              </div>
              {observations.length === 0 ? (
                <p className="text-xs text-ink-400">No community readings yet for this selection.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {observations.map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-sm bg-ink-50 dark:bg-ink-700/40 rounded-xl px-3 py-2">
                      <div className="min-w-0">
                        <span className="font-medium text-ink-700 dark:text-ink-300">{o.district || o.state}</span>
                        <span className="text-ink-500 dark:text-ink-400"> — {o.well_depth_m}m</span>
                        {o.note && <div className="text-xs text-ink-400 mt-0.5 truncate">{o.note}</div>}
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 shrink-0 ml-2">
                        unverified
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
