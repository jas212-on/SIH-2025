import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Wheat, ArrowLeft, Droplets, CalendarDays, Repeat, Sprout, Sparkles, ClipboardList, Info } from "lucide-react";
import { api } from "../services/api";
import { useStates, useDistricts } from "../hooks/useReferenceData";
import { useToast } from "../components/common/Toast";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import WaveDivider from "../components/home/WaveDivider";

const RISK_COLORS = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  severe: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  unknown: "bg-ink-100 text-ink-700 dark:bg-ink-700 dark:text-ink-300",
};

export default function AdvisoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState("KERALA");
  const [district, setDistrict] = useState("");
  const { states } = useStates();
  const { districts } = useDistricts(state);
  const [crop, setCrop] = useState("rice");
  const [crops, setCrops] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.advisoryCrops().then((d) => setCrops(d.crops || [])).catch(() => setCrops(["rice", "wheat", "maize"]));
  }, []);

  async function getAdvisory() {
    setLoading(true);
    setResult(null);
    try {
      const data = await api.advisory({ state, district: district || undefined, crop });
      setResult(data);
    } catch (e) {
      toast(e.message || "Could not generate advisory", "error");
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
                  {t('pages.advisory.title')}
                </h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">{t('pages.advisory.subtitle')}</p>
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
              <option value="">Whole state</option>
              {districts.map((d) => <option key={d} value={d}>{d.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide block mb-1">Crop</label>
            <select value={crop} onChange={(e) => setCrop(e.target.value)}
              className="px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-brand-500">
              {crops.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={getAdvisory} disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-full shadow-soft transition text-sm ml-auto">
            <Sprout size={14} />
            {loading ? "Analyzing..." : "Get Recommendation"}
          </button>
        </div>
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-14 py-6">
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center text-center py-24 text-ink-400 dark:text-ink-500">
            <Wheat size={48} className="mb-3" />
            <p className="text-sm">Choose a state, district, and crop, then click <strong>Get Recommendation</strong>.</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin w-9 h-9 border-4 border-brand-500 border-t-transparent rounded-full" />
          </div>
        )}

        {result && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: headline + metrics */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-5">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <h3 className="font-semibold text-lg text-ink-800 dark:text-ink-100">
                    {result.location} — <span className="capitalize">{result.crop}</span> ({result.season})
                  </h3>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${RISK_COLORS[result.risk_flag] || RISK_COLORS.unknown}`}>
                    {result.risk_flag} risk
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-ink-50 dark:bg-ink-700/40 rounded-xl p-3">
                    <div className="text-xs text-ink-500 dark:text-ink-400">Water Requirement</div>
                    <div className="font-bold text-ink-800 dark:text-ink-100">{result.water_requirement_mm}mm</div>
                  </div>
                  <div className="bg-ink-50 dark:bg-ink-700/40 rounded-xl p-3">
                    <div className="text-xs text-ink-500 dark:text-ink-400">Recent Rainfall</div>
                    <div className="font-bold text-ink-800 dark:text-ink-100">{result.recent_rainfall_mm}mm</div>
                  </div>
                  <div className="bg-ink-50 dark:bg-ink-700/40 rounded-xl p-3">
                    <div className="text-xs text-ink-500 dark:text-ink-400">Irrigation Needed</div>
                    <div className="font-bold text-ink-800 dark:text-ink-100">{result.irrigation_needed_mm}mm</div>
                  </div>
                  <div className="bg-ink-50 dark:bg-ink-700/40 rounded-xl p-3">
                    <div className="text-xs text-ink-500 dark:text-ink-400">Confidence</div>
                    <div className="font-bold text-ink-800 dark:text-ink-100">{result.water_availability_confidence}%</div>
                  </div>
                </div>

                {/* Rainfall coverage bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-ink-500 dark:text-ink-400 mb-1">
                    <span>Rainfall covers {result.rainfall_coverage_pct}% of requirement</span>
                  </div>
                  <div className="w-full bg-ink-200 dark:bg-ink-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(result.rainfall_coverage_pct, 100)}%` }} />
                  </div>
                </div>
              </div>

              <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 dark:text-brand-400 mb-1.5">
                  <ClipboardList size={13} /> Recommended Action
                </div>
                <p className="text-sm text-brand-900 dark:text-brand-200 leading-relaxed">{result.recommended_action}</p>
              </div>

              {result.ai_insight && (
                <div className="bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-ink-800 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-800/40 p-4">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-400 mb-2">
                    <Sparkles size={14} /> AI Insight
                  </h3>
                  <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">{result.ai_insight}</p>
                </div>
              )}

              {result.water_saving_techniques?.length > 0 && (
                <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink-700 dark:text-ink-300 mb-3">
                    <Droplets size={14} className="text-brand-600" /> Water-Saving Techniques
                  </h3>
                  <ul className="space-y-2">
                    {result.water_saving_techniques.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: crop timing + alternate */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400 mb-1">
                  <CalendarDays size={13} /> Sowing Window
                </div>
                <div className="font-bold text-ink-800 dark:text-ink-100">{result.sowing_window}</div>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-1.5 leading-relaxed">{result.sowing_note}</p>
              </div>

              <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400 mb-1">
                  <Repeat size={13} /> Irrigation Frequency
                </div>
                <div className="text-sm font-semibold text-ink-800 dark:text-ink-100">{result.irrigation_frequency}</div>
              </div>

              <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400 mb-1">
                  <Info size={13} /> Crop Duration
                </div>
                <div className="text-sm font-semibold text-ink-800 dark:text-ink-100">{result.duration_days} days</div>
              </div>

              {result.alternate_crop && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                    <Sprout size={13} /> Lower-Water Alternate Crop
                  </div>
                  <p className="text-sm text-amber-900 dark:text-amber-300">{result.alternate_crop}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
