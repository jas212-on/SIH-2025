import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Chart, registerables } from "chart.js";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, LineChart, ArrowLeft, Sparkles, Droplets, ClipboardList, ShieldAlert, Info } from "lucide-react";
import { api } from "../services/api";
import { ALL_STATES } from "../config/constants";
import { useToast } from "../components/common/Toast";
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

export default function ForecastPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState("KERALA");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const toast = useToast();

  async function fetchForecast() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.forecast(state);
      setResult(data);
    } catch (e) {
      setError(e.message || "Failed to load forecast");
      toast(e.message || "Failed to load forecast", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchForecast();
  }, [state]);

  useEffect(() => {
    if (!result?.historical_data || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const historical = result.historical_data || [];
    const projected = result.projected_data || [];
    const allLabels = [...historical.map((d) => d.year), ...projected.map((d) => d.year)];
    const histValues = historical.map((d) => d.value);
    const projValues = [...new Array(historical.length).fill(null), ...projected.map((d) => d.value)];
    const projPointColors = [
      ...new Array(historical.length).fill("rgb(245,158,11)"),
      ...projected.map((d) => RISK_POINT_COLORS[d.risk] || "rgb(245,158,11)"),
    ];
    // bridge line: last historical point connects to first projected
    const bridgeValues = new Array(allLabels.length).fill(null);
    if (historical.length > 0 && projected.length > 0) {
      bridgeValues[historical.length - 1] = historical[historical.length - 1].value;
      bridgeValues[historical.length] = projected[0].value;
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: allLabels,
        datasets: [
          {
            label: "Historical",
            data: histValues.concat(new Array(projected.length).fill(null)),
            borderColor: "rgb(23,134,133)",
            backgroundColor: "rgba(23,134,133,0.1)",
            borderWidth: 2.5,
            fill: true,
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: "Projected",
            data: projValues,
            borderColor: "rgb(245,158,11)",
            backgroundColor: "rgba(245,158,11,0.1)",
            borderWidth: 2.5,
            borderDash: [8, 4],
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: projPointColors,
            pointBorderColor: "#fff",
            pointBorderWidth: 1.5,
          },
          {
            label: "_bridge",
            data: bridgeValues,
            borderColor: "rgba(156,163,175,0.5)",
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: { filter: (item) => !item.text.startsWith("_") },
          },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: { color: "#6b7280" },
            grid: { color: "rgba(107,114,128,0.1)" },
            title: { display: true, text: result.unit || "ham", color: "#6b7280" },
          },
          x: {
            ticks: { color: "#6b7280" },
            grid: { color: "rgba(107,114,128,0.1)" },
            title: { display: true, text: "Year", color: "#6b7280" },
          },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [result]);

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
                  {t('pages.forecast.title')}
                </h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">{t('pages.forecast.subtitle')}</p>
              </div>
            </button>
          </div>
        </div>
        <WaveDivider position="bottom" fillClassName="fill-ink-50 dark:fill-ink-950" duration={26} className="!h-3 opacity-60" />
      </header>

      {/* Toolbar */}
      <div className="bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 px-6 sm:px-10 lg:px-14 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {ALL_STATES.map((s) => (
              <option key={s} value={s}>
                {s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-14 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Forecast metrics cards */}
            {result?.metrics && (
              <div className="space-y-3">
                <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                  <div className="text-xs text-ink-500 dark:text-ink-400 mb-1">Current vs. Projected</div>
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
                  <div className="text-xs text-ink-500 dark:text-ink-400 mb-1">Risk Level</div>
                  <div className={`text-lg font-bold ${
                    result.metrics.risk_level === "High" ? "text-red-600" :
                    result.metrics.risk_level === "Medium" ? "text-amber-600" : "text-green-600"
                  }`}>
                    {result.metrics.risk_level || "N/A"}
                  </div>
                </div>

                <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                  <div className="text-xs text-ink-500 dark:text-ink-400 mb-1">Trend Direction</div>
                  <div className="text-lg font-bold text-ink-800 dark:text-ink-100 flex items-center gap-2">
                    {result.metrics.trend === "increasing" && <TrendingUp size={18} className="text-red-500" />}
                    {result.metrics.trend === "decreasing" && <TrendingDown size={18} className="text-green-500" />}
                    {result.metrics.trend === "stable" && <Minus size={18} className="text-brand-500" />}
                    <span className="capitalize">{result.metrics.trend || "N/A"}</span>
                  </div>
                </div>

                {result.metrics.confidence && (
                  <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                    <div className="text-xs text-ink-500 dark:text-ink-400 mb-1">Confidence</div>
                    <div className="text-lg font-bold text-ink-800 dark:text-ink-100">{result.metrics.confidence}%</div>
                    <div className="mt-1 w-full bg-ink-200 dark:bg-ink-700 rounded-full h-1.5">
                      <div className="bg-brand-600 h-1.5 rounded-full" style={{ width: `${result.metrics.confidence}%` }} />
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
                  <div className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800/50 p-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 dark:text-brand-400 mb-1.5">
                      <ClipboardList size={13} /> Recommended Action
                    </div>
                    <p className="text-sm text-brand-900 dark:text-brand-200 leading-relaxed">{result.rules.recommended_action}</p>
                  </div>
                )}

                {result.rules?.data_confidence_note && (
                  <div className="flex items-start gap-1.5 text-xs text-ink-400 dark:text-ink-500 leading-relaxed px-1">
                    <Info size={13} className="shrink-0 mt-0.5" />
                    <span>{result.rules.data_confidence_note}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chart area */}
          <div className="lg:col-span-3 space-y-4">
            {result?.rules?.threshold_crossing && (
              <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4">
                <ShieldAlert size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                  Projected to cross from <strong>{result.rules.threshold_crossing.from_risk}</strong> into{" "}
                  <strong>{result.rules.threshold_crossing.to_risk}</strong> by {result.rules.threshold_crossing.year}.
                </p>
              </div>
            )}

            <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-6 min-h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center py-16">
                  <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
                </div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-red-500 gap-3 py-16">
                  <AlertTriangle size={40} />
                  <p className="text-sm">{error}</p>
                  <button onClick={fetchForecast} className="text-sm text-brand-600 hover:underline">Retry</button>
                </div>
              ) : result ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-ink-700 dark:text-ink-300">
                      {result.title || `Forecast for ${state.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}`}
                    </h3>
                  </div>
                  <canvas ref={chartRef} />
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-ink-400 gap-3 py-16">
                  <LineChart size={48} />
                  <p className="text-sm">Select a state to view forecasting data</p>
                </div>
              )}
            </div>

            {/* Summary — deterministic, rule-based, always present */}
            {result?.summary && (
              <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-4">
                <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-2">Analysis Summary</h3>
                <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{result.summary}</p>
              </div>
            )}

            {/* AI Insight — supplementary narrative from Gemini; the page works identically without it */}
            {result?.ai_insight && (
              <div className="bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-ink-800 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-800/40 p-4">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-400 mb-2">
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
