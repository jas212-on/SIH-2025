import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import { api } from "../services/api";
import { ALL_STATES, KERALA_DISTRICTS } from "../config/constants";
import { useToast } from "../components/common/Toast";
import PageHeader from "../components/common/PageHeader";

export default function FieldObservationPage() {
  const { t } = useTranslation();
  const [state, setState] = useState("KERALA");
  const [district, setDistrict] = useState("");
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
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900 p-6">
      <div className="max-w-3xl mx-auto">
        <PageHeader icon={MapPin} iconClassName="text-teal-600" title={t('pages.fieldData.title')} subtitle={t('pages.fieldData.subtitle')} />

        <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink-500 dark:text-ink-400 block mb-1">State</label>
              <select value={state} onChange={(e) => { setState(e.target.value); setDistrict(""); }}
                className="w-full px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-sm">
                {ALL_STATES.map((s) => <option key={s} value={s}>{s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ink-500 dark:text-ink-400 block mb-1">District (optional)</label>
              <select value={district} onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-sm">
                <option value="">Not sure / whole state</option>
                {state === "KERALA" && KERALA_DISTRICTS.map((d) => <option key={d} value={d}>{d.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500 dark:text-ink-400 block mb-1">Well depth (meters)</label>
            <input type="number" step="0.1" value={wellDepthM} onChange={(e) => setWellDepthM(e.target.value)}
              placeholder="e.g. 12.5"
              className="w-full px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500 dark:text-ink-400 block mb-1">Note (optional)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
              placeholder="e.g. well is drying up faster than last year"
              className="w-full px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-sm resize-none" />
          </div>
          <button onClick={submit} disabled={loading}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium rounded-xl transition text-sm">
            {loading ? "Submitting..." : "Submit Reading"}
          </button>
          <p className="text-xs text-ink-400">
            Community-reported data is clearly labeled as unverified and never mixed silently with official CGWB data.
          </p>
        </div>

        <div className="mt-6 bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-5">
          <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-3">Recent Community Readings — {state}</h3>
          {observations.length === 0 ? (
            <p className="text-xs text-ink-400">No community readings yet for this selection.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {observations.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm bg-ink-50 dark:bg-ink-700/40 rounded-lg px-3 py-2">
                  <div>
                    <span className="font-medium text-ink-700 dark:text-ink-300">{o.district || o.state}</span>
                    <span className="text-ink-500 dark:text-ink-400"> — {o.well_depth_m}m</span>
                    {o.note && <div className="text-xs text-ink-400 mt-0.5">{o.note}</div>}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 shrink-0">
                    unverified
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
