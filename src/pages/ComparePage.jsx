import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Chart, registerables } from "chart.js";
import { BarChart3, ArrowRight, ArrowLeft, Download, FileDown, Clock, Play } from "lucide-react";
import { api } from "../services/api";
import { METRICS, ALL_STATES, AVAILABLE_YEARS, CHART_TYPES } from "../config/constants";
import { useToast } from "../components/common/Toast";
import WaveDivider from "../components/home/WaveDivider";

const MODE_TO_COMPARISON_TYPE = { states: "state", yearly: "yearly", metrics: "metric" };

function buildVisualizeRequest(mode, params) {
  const comparison_type = MODE_TO_COMPARISON_TYPE[mode];
  const base = { chart_type: params.chartType, comparison_type, filters: { year: params.year } };
  if (mode === "states") {
    return { ...base, states: params.states, metrics: [params.metric] };
  }
  if (mode === "yearly") {
    return {
      ...base,
      years: AVAILABLE_YEARS,
      metrics: [params.metric],
      filters: { entity: (params.states[0] || "KERALA"), entity_type: "state" },
    };
  }
  // metrics (multi-metric / radar)
  return {
    ...base,
    metrics: params.metrics,
    filters: { entity: (params.states[0] || "KERALA"), entity_type: "state" },
  };
}

Chart.register(...registerables);

const COMPARE_MODES = [
  { id: "states",  label: "State vs State" },
  { id: "yearly",  label: "Year-over-Year" },
  { id: "metrics", label: "Multi-Metric" },
];

export default function ComparePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode]   = useState("states");
  const [params, setParams] = useState({
    states:  ["KERALA", "MAHARASHTRA"],
    metric:  "availability",
    year:    2024,
    metrics: ["availability", "recharge", "draft"],
    chartType: "bar",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [freshness, setFreshness] = useState(null);
  const [forecastPreview, setForecastPreview] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const toast = useToast();

  useEffect(() => {
    api.dataFreshness().then(setFreshness).catch(() => {});
  }, []);

  useEffect(() => {
    if (mode !== "states" || params.states.length === 0) { setForecastPreview(null); return; }
    let cancelled = false;
    api.forecast(params.states[0]).then((d) => { if (!cancelled) setForecastPreview(d); }).catch(() => {});
    return () => { cancelled = true; };
  }, [mode, params.states]);

  async function downloadReport() {
    const state = params.states[0] || "KERALA";
    try {
      const res = await api.generateReport(state);
      if (!res.ok) throw new Error("Report generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `jalmitra_report_${state}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast(e.message || "Report generation failed", "error");
    }
  }

  function setParam(key, val) {
    setParams((p) => ({ ...p, [key]: val }));
  }

  function toggleItem(key, val) {
    setParams((p) => {
      const arr = p[key];
      return { ...p, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  }

  async function runComparison() {
    if (mode === "states" && params.states.length < 2) {
      toast("Select at least 2 states", "warning"); return;
    }
    if (mode === "metrics" && params.chartType === "radar" && params.metrics.length < 3) {
      toast("Select at least 3 metrics for a radar chart", "warning"); return;
    }
    setLoading(true);
    try {
      const body = buildVisualizeRequest(mode, params);
      const data = await api.visualize(body);
      if (data.error) {
        toast(data.error, "error");
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (e) {
      toast(e.message || "Comparison failed", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!result?.data || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const ctx = chartRef.current.getContext("2d");
    // Backend already returns a complete Chart.js config (type/data/options).
    chartInstance.current = new Chart(ctx, result.data);
    return () => chartInstance.current?.destroy();
  }, [result]);

  async function exportCSV() {
    try {
      const body = buildVisualizeRequest(mode, params);
      const res = await api.export({
        comparison_type: body.comparison_type,
        metrics: body.metrics,
        states: body.states,
        years: body.years,
        filters: body.filters,
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `jalmitra_${mode}_${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast("Export failed", "error");
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <header className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 shadow-card z-10">
        <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-16 h-16 flex items-center justify-between gap-4">
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
                  {t('pages.compare.title')}
                </h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">{t('pages.compare.subtitle')}</p>
              </div>
            </button>
          </div>
        </div>
        <WaveDivider position="bottom" fillClassName="fill-ink-50 dark:fill-ink-950" duration={26} className="!h-3 opacity-60" />
      </header>

      {/* Toolbar — quick controls + primary action, always visible at the top */}
      <div className="bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 px-8 sm:px-12 lg:px-16 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {mode !== "metrics" && (
            <select value={params.metric} onChange={(e) => setParam("metric", e.target.value)}
              className="px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              {METRICS.map((m) => <option key={m.id} value={m.id}>{m.label} ({m.unit})</option>)}
            </select>
          )}
          <select value={params.year} onChange={(e) => setParam("year", Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            {AVAILABLE_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={params.chartType} onChange={(e) => setParam("chartType", e.target.value)}
            className="px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            {CHART_TYPES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <button onClick={runComparison} disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-full shadow-soft transition text-sm ml-auto">
            <Play size={14} className={loading ? "animate-pulse" : ""} />
            {loading ? "Comparing..." : "Compare"}
          </button>
        </div>
      </div>

      <div className="w-full px-8 sm:px-12 lg:px-16 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Mode */}
            <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
              <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-3">Comparison Mode</h3>
              <div className="space-y-2">
                {COMPARE_MODES.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="mode" value={m.id} checked={mode === m.id}
                      onChange={() => setMode(m.id)}
                      className="accent-brand-600" />
                    <span className="text-sm text-ink-700 dark:text-ink-300">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* State picker */}
            {(mode === "states" || mode === "yearly") && (
              <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-3">
                  States <span className="text-ink-400 font-normal">(select 2–5)</span>
                </h3>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {ALL_STATES.map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={params.states.includes(s)}
                        onChange={() => toggleItem("states", s)}
                        disabled={!params.states.includes(s) && params.states.length >= 5}
                        className="accent-brand-600 shrink-0" />
                      <span className="text-xs text-ink-700 dark:text-ink-300 capitalize">
                        {s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Multi-metric picker */}
            {mode === "metrics" && (
              <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-3">Metrics</h3>
                <div className="space-y-1">
                  {METRICS.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={params.metrics.includes(m.id)}
                        onChange={() => toggleItem("metrics", m.id)}
                        className="accent-brand-600" />
                      <span className="text-xs text-ink-700 dark:text-ink-300">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Chart area */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-6 min-h-80">
              {result ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-ink-700 dark:text-ink-300">
                      {result.data?.options?.plugins?.title?.text || "Comparison Results"}
                    </h3>
                    <div className="flex gap-2">
                      <button onClick={exportCSV}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700 transition">
                        <Download size={13} />
                        Export CSV
                      </button>
                      <button onClick={downloadReport}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700 transition">
                        <FileDown size={13} />
                        PDF Report
                      </button>
                    </div>
                  </div>
                  <div className="relative h-[450px] w-full">
                    <canvas ref={chartRef} />
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-ink-400 gap-3 py-16">
                  <BarChart3 size={48} />
                  <p className="text-sm">Configure your comparison and click <strong>Compare</strong></p>
                </div>
              )}
            </div>

            {result && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-ink-800 rounded-xl border border-ink-100 dark:border-ink-700 p-3">
                  <div className="text-xs text-ink-500 dark:text-ink-400 mb-1">Data Points</div>
                  <div className="text-lg font-bold text-ink-800 dark:text-ink-100">{result.metadata?.data_points ?? "—"}</div>
                </div>
                <div className="bg-white dark:bg-ink-800 rounded-xl border border-ink-100 dark:border-ink-700 p-3">
                  <div className="text-xs text-ink-500 dark:text-ink-400 mb-1">Processing Time</div>
                  <div className="text-lg font-bold text-ink-800 dark:text-ink-100">{result.processing_time}s</div>
                </div>
              </div>
            )}

            {/* Forecast overlay (roadmap 2.1 / 3.3): quick projection for the first selected state */}
            {mode === "states" && params.states.length > 0 && (
              <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300">
                    Forecast overlay — {params.states[0]}
                  </h3>
                  <Link to="/forecast" className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline">
                    Open full forecast <ArrowRight size={12} />
                  </Link>
                </div>
                {forecastPreview ? (
                  <p className="text-sm text-ink-600 dark:text-ink-400">{forecastPreview.summary}</p>
                ) : (
                  <p className="text-xs text-ink-400">Loading forecast…</p>
                )}
              </div>
            )}

            {freshness && (
              <div className="text-xs text-ink-400 flex items-center gap-1.5">
                <Clock size={12} />
                <span>{freshness.last_ingested} · District detail: {freshness.district_coverage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
