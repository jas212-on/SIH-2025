import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Chart, registerables } from "chart.js";
import {
  SlidersHorizontal, ArrowLeft, Play, TrendingUp, TrendingDown, Minus,
  Sparkles, ClipboardList, Droplets, ShieldAlert, Info,
} from "lucide-react";
import { api } from "../services/api";
import { ALL_STATES } from "../config/constants";
import { useToast } from "../components/common/Toast";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import WaveDivider from "../components/home/WaveDivider";

Chart.register(...registerables);

const RISK_COLORS = {
  Safe: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Semi-Critical": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Critical: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "Over-Exploited": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const RISK_POINT_COLORS = {
  Safe: "rgb(34,166,133)",
  "Semi-Critical": "rgb(234,179,8)",
  Critical: "rgb(249,115,22)",
  "Over-Exploited": "rgb(239,68,68)",
};

export default function SimulatorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState("KERALA");
  const [draftChangePct, setDraftChangePct] = useState(-15);
  const [horizon, setHorizon] = useState(5);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const toast = useToast();

  async function runSimulation() {
    setLoading(true);
    try {
      const data = await api.simulate({ state, draftChangePct, horizon });
      setResult(data);
    } catch (e) {
      toast(e.message || "Simulation failed", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { runSimulation(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!result?.projected_data || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const historical = result.historical_data || [];
    const projected = result.projected_data || [];
    const allLabels = [...historical.map((d) => d.year), ...projected.map((d) => d.year)];
    const projPointColors = projected.map((d) => RISK_POINT_COLORS[d.risk] || "rgb(168,85,247)");
    chartInstance.current = new Chart(chartRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels: allLabels,
        datasets: [
          {
            label: "Historical",
            data: [...historical.map((d) => d.value), ...new Array(projected.length).fill(null)],
            borderColor: "rgb(23,134,133)", backgroundColor: "rgba(23,134,133,0.1)",
            borderWidth: 2.5, fill: true, tension: 0.3, pointRadius: 4,
          },
          {
            label: `Projected (draft ${draftChangePct >= 0 ? "+" : ""}${draftChangePct}%)`,
            data: [...new Array(historical.length).fill(null), ...projected.map((d) => d.value)],
            borderColor: "rgb(168,85,247)", backgroundColor: "rgba(168,85,247,0.1)",
            borderWidth: 2.5, borderDash: [8, 4], fill: true, tension: 0.3,
            pointRadius: 5, pointBackgroundColor: projPointColors, pointBorderColor: "#fff", pointBorderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } },
        scales: {
          y: { beginAtZero: false, title: { display: true, text: "Stage of Extraction (%)" } },
          x: { title: { display: true, text: "Year" } },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [result, draftChangePct]);

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
                  {t('pages.simulator.title')}
                </h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">{t('pages.simulator.subtitle')}</p>
              </div>
            </button>
          </div>
          <LanguageSwitcher className="text-white shrink-0" />
        </div>
        <WaveDivider position="bottom" fillClassName="fill-ink-50 dark:fill-ink-950" duration={26} className="!h-3 opacity-60" />
      </header>

      {/* Toolbar */}
      <div className="bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 px-6 sm:px-10 lg:px-14 py-3">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-[11px] font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide block mb-1">State</label>
            <select value={state} onChange={(e) => setState(e.target.value)}
              className="px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              {ALL_STATES.map((s) => <option key={s} value={s}>{s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
            </select>
          </div>
          <div className="min-w-[220px]">
            <label className="text-[11px] font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide block mb-1">
              Draft change: <span className="font-bold text-ink-800 dark:text-ink-100">{draftChangePct >= 0 ? "+" : ""}{draftChangePct}%</span>
            </label>
            <input type="range" min="-90" max="100" value={draftChangePct}
              onChange={(e) => setDraftChangePct(Number(e.target.value))}
              className="w-full accent-purple-600" />
          </div>
          <div className="min-w-[160px]">
            <label className="text-[11px] font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide block mb-1">Horizon: {horizon} yr</label>
            <input type="range" min="1" max="10" value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full accent-purple-600" />
          </div>
          <button onClick={runSimulation} disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-full shadow-soft transition text-sm ml-auto">
            <Play size={14} className={loading ? "animate-pulse" : ""} />
            {loading ? "Simulating..." : "Run Simulation"}
          </button>
        </div>
        <p className="text-[11px] text-ink-400 dark:text-ink-500 mt-2">
          Negative = reduce draft (e.g. efficient irrigation policy), positive = increase draft.
        </p>
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-14 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {result?.metrics && (
              <>
                <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                  <div className="text-xs text-ink-500 dark:text-ink-400 mb-1">Current vs. Simulated</div>
                  <div className="flex items-center gap-2">
                    {result.metrics.current_risk && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${RISK_COLORS[result.metrics.current_risk] || "bg-ink-100 text-ink-700"}`}>
                        {result.metrics.current_risk}
                      </span>
                    )}
                    <span className="text-ink-300 dark:text-ink-600">&rarr;</span>
                    {result.metrics.stage_of_extraction && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${RISK_COLORS[result.metrics.stage_of_extraction] || "bg-ink-100 text-ink-700"}`}>
                        {result.metrics.stage_of_extraction}
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-bold text-ink-800 dark:text-ink-100 mt-1.5">{result.metrics.stage_of_extraction_pct || "N/A"}</div>
                </div>

                <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                  <div className="text-xs text-ink-500 dark:text-ink-400 mb-1">Trend Direction</div>
                  <div className="text-lg font-bold text-ink-800 dark:text-ink-100 flex items-center gap-2">
                    {result.metrics.trend === "increasing" && <TrendingUp size={18} className="text-red-500" />}
                    {result.metrics.trend === "decreasing" && <TrendingDown size={18} className="text-green-500" />}
                    {result.metrics.trend === "stable" && <Minus size={18} className="text-purple-500" />}
                    <span className="capitalize">{result.metrics.trend || "N/A"}</span>
                  </div>
                </div>

                {result.metrics.confidence && (
                  <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                    <div className="text-xs text-ink-500 dark:text-ink-400 mb-1">Confidence</div>
                    <div className="text-lg font-bold text-ink-800 dark:text-ink-100">{result.metrics.confidence}%</div>
                    <div className="mt-1 w-full bg-ink-200 dark:bg-ink-700 rounded-full h-1.5">
                      <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${result.metrics.confidence}%` }} />
                    </div>
                  </div>
                )}

                {result.rules?.groundwater_balance && (
                  <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                    <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400 mb-1">
                      <Droplets size={13} /> Draft-to-Recharge Ratio
                    </div>
                    <div className="text-lg font-bold text-ink-800 dark:text-ink-100">{result.rules.groundwater_balance.draft_to_recharge_ratio}</div>
                    <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">{result.rules.groundwater_balance.label}</p>
                  </div>
                )}

                {result.rules?.recommended_action && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/50 p-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                      <ClipboardList size={13} /> Recommended Action
                    </div>
                    <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed">{result.rules.recommended_action}</p>
                  </div>
                )}

                {result.rules?.data_confidence_note && (
                  <div className="flex items-start gap-1.5 text-xs text-ink-400 dark:text-ink-500 leading-relaxed px-1">
                    <Info size={13} className="shrink-0 mt-0.5" />
                    <span>{result.rules.data_confidence_note}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-3 space-y-4">
            {result?.rules?.threshold_crossing && (
              <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4">
                <ShieldAlert size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                  With this draft change, extraction is projected to cross from <strong>{result.rules.threshold_crossing.from_risk}</strong> into{" "}
                  <strong>{result.rules.threshold_crossing.to_risk}</strong> by {result.rules.threshold_crossing.year}.
                </p>
              </div>
            )}

            <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-6 min-h-80">
              <canvas ref={chartRef} />
            </div>

            {result?.summary && (
              <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-2">Analysis</h3>
                <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{result.summary}</p>
              </div>
            )}

            {result?.ai_insight && (
              <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-ink-800 rounded-2xl shadow-sm border border-purple-100 dark:border-purple-800/40 p-4">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">
                  <Sparkles size={14} /> AI Insight
                </h3>
                <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">{result.ai_insight}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
