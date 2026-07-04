import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Layers, X, MousePointerClick, TrendingUp, TrendingDown } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { api } from "../services/api";
import { AVAILABLE_YEARS } from "../config/constants";
import { useMetrics } from "../hooks/useReferenceData";
import { useToast } from "../components/common/Toast";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import FlowBackground from "../components/home/FlowBackground";

// Well-maintained India states GeoJSON (state-level boundaries, ST_NM property).
const GEO_URL =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

const VALUE_SCALE = {
  availability: { low: 1000, high: 50000, unit: "ham" },
  recharge:     { low: 500,  high: 30000, unit: "ham" },
  draft:        { low: 100,  high: 20000, unit: "ham" },
  rainfall:     { low: 200,  high: 3000,  unit: "mm"  },
  groundwater:  { low: 500,  high: 60000, unit: "ham" },
};

const UNION_TERRITORIES = new Set([
  "ANDAMAN AND NICOBAR ISLANDS",
  "CHANDIGARH",
  "DADRA AND NAGAR HAVELI",
  "DAMAN AND DIU",
  "DELHI",
  "JAMMU AND KASHMIR",
  "LADAKH",
  "LAKSHDWEEP",
  "PUDUCHERRY",
]);

// Rose (low) -> brand teal (high), matching the app's brand palette.
function interpolateColor(value, low, high) {
  const ratio = Math.max(0, Math.min(1, (value - low) / (high - low)));
  const r = Math.round(239 - ratio * (239 - 34));
  const g = Math.round(68  + ratio * (166 - 68));
  const b = Math.round(68  + ratio * (163 - 68));
  return `rgb(${r},${g},${b})`;
}

function geoName(geo) {
  const p = geo.properties || {};
  return p.ST_NM || p.NAME_1 || p.name || "";
}

function titleCase(s) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function MapPage() {
  const { t } = useTranslation();
  const { metrics: METRICS } = useMetrics();
  const [metric, setMetric] = useState("availability");
  const [year, setYear]     = useState(AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]);
  const [dataByYear, setDataByYear] = useState({}); // { [year]: { STATE: {value, lat, lng} } }
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [dataSource, setDataSource] = useState("checking"); // checking | live | cached | offline
  const [panelOpen, setPanelOpen] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 768 : true);
  const toast = useToast();
  const navigate = useNavigate();
  const mapWrapRef = useRef(null);

  // Not every year has state-level coverage in the graph (e.g. some years are
  // Kerala-district-only) — only offer years that actually returned data.
  const yearsWithData = AVAILABLE_YEARS.filter((y) => Object.keys(dataByYear[y] || {}).length > 0);
  const otherYear = yearsWithData.find((y) => y !== year);

  function goToChat(stateName) {
    if (!stateName) return;
    navigate("/chat", {
      state: { initialQuery: `What is the ${metric} status in ${stateName}?` },
    });
  }

  useEffect(() => {
    let cancelled = false;
    api.health()
      .then((h) => { if (!cancelled) setDataSource(h?.services?.neo4j === "up" ? "live" : "cached"); })
      .catch(() => { if (!cancelled) setDataSource("offline"); });
    return () => { cancelled = true; };
  }, []);

  // Fetch every available year for the current metric so we can toggle
  // instantly and show a trend, instead of animating through a 2-point series.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(AVAILABLE_YEARS.map((y) => api.mapStates(metric, y).then((d) => [y, d])))
      .then((results) => {
        if (cancelled) return;
        const next = {};
        for (const [y, d] of results) {
          const keyed = {};
          for (const row of d.data || []) keyed[row.state?.toUpperCase()] = row;
          next[y] = keyed;
        }
        setDataByYear(next);
        // If the currently selected year has no state-level data, jump to
        // the most recent year that does, so the map isn't blank by default.
        setYear((y) => (Object.keys(next[y] || {}).length > 0
          ? y
          : [...AVAILABLE_YEARS].reverse().find((yr) => Object.keys(next[yr] || {}).length > 0) || y));
      })
      .catch(() => { if (!cancelled) toast("Failed to load map data", "error"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [metric]);

  const mapData = dataByYear[year] || {};
  const prevData = dataByYear[otherYear] || {};
  const scale = VALUE_SCALE[metric] || VALUE_SCALE.availability;
  const metricLabel = METRICS.find((m) => m.id === metric)?.label || metric;

  function fillForState(stateName) {
    const key = stateName?.toUpperCase();
    const entry = mapData[key];
    if (!entry) return "#e2e8f0";
    return interpolateColor(entry.value ?? 0, scale.low, scale.high);
  }

  const handleMouseMove = useCallback((e) => {
    const rect = mapWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip((t) => (t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : t));
  }, []);

  const sourceMeta = {
    checking: { color: "bg-amber-400", pulse: true,  label: "Connecting…" },
    live:     { color: "bg-emerald-400", pulse: false, label: "Live · Neo4j graph" },
    cached:   { color: "bg-amber-400", pulse: false, label: "Cached CGWB data" },
    offline:  { color: "bg-rose-400",  pulse: false, label: "Data unavailable" },
  }[dataSource];

  const { states, uts } = useMemo(() => {
    const entries = Object.entries(mapData).filter(([, v]) => v?.value != null);
    entries.sort(([, a], [, b]) => (b.value ?? 0) - (a.value ?? 0));
    return {
      states: entries.filter(([name]) => !UNION_TERRITORIES.has(name)),
      uts: entries.filter(([name]) => UNION_TERRITORIES.has(name)),
    };
  }, [mapData]);

  function trendFor(stateName) {
    const key = stateName?.toUpperCase();
    const cur = mapData[key]?.value;
    const prev = prevData[key]?.value;
    if (cur == null || prev == null || prev === 0) return null;
    const pct = ((cur - prev) / prev) * 100;
    return { pct, up: pct >= 0 };
  }

  return (
    <div className="flex flex-col h-screen bg-ink-50 dark:bg-ink-950">
      {/* Header — matches chat.jsx's gradient bar */}
      <header className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 shadow-card z-30 shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
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
                  {t("pages.map.title")}
                </h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">{t("pages.map.subtitle")}</p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div
              title={sourceMeta.label}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium"
            >
              <span className="relative flex w-2 h-2">
                {sourceMeta.pulse && <span className={`absolute inline-flex h-full w-full rounded-full ${sourceMeta.color} animate-ping`} />}
                <span className={`relative inline-flex w-2 h-2 rounded-full ${sourceMeta.color}`} />
              </span>
              {sourceMeta.label}
            </div>
            <button
              onClick={() => setPanelOpen((v) => !v)}
              title={panelOpen ? "Hide legend & rankings" : "Show legend & rankings"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                panelOpen ? "bg-white text-brand-700" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <Layers size={14} />
              <span className="hidden sm:inline">Legend</span>
            </button>
            <LanguageSwitcher className="text-white" />
          </div>
        </div>
      </header>

      {/* Full-bleed map canvas */}
      <div ref={mapWrapRef} onMouseMove={handleMouseMove} className="relative flex-1 min-h-0 overflow-hidden">
        <FlowBackground className="opacity-30 dark:opacity-25 pointer-events-none" showLines={false} showBubbles={false} />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-50/60 dark:bg-ink-950/60 z-20">
            <div className="animate-spin w-9 h-9 border-4 border-brand-500 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Prominent "click a state" callout */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: [0, -4, 0] }}
          transition={{ opacity: { duration: 0.4 }, y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600 text-white text-xs sm:text-sm font-semibold shadow-card"
        >
          <MousePointerClick size={15} className="shrink-0" />
          Click any state to ask Jalmitra about it
        </motion.div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 1100, center: [82.8, 22] }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={5}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = geoName(geo);
                  const entry = mapData[(name || "").toUpperCase()];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillForState(name)}
                      stroke="#ffffff"
                      strokeWidth={0.6}
                      onMouseEnter={(e) => {
                        const rect = mapWrapRef.current?.getBoundingClientRect();
                        setTooltip({
                          name,
                          value: entry?.value,
                          unit: scale.unit,
                          x: rect ? e.clientX - rect.left : 0,
                          y: rect ? e.clientY - rect.top : 0,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => goToChat(name)}
                      style={{
                        default: { outline: "none", cursor: "pointer", transition: "fill 200ms" },
                        hover:   { outline: "none", opacity: 0.85, cursor: "pointer" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{ left: tooltip.x, top: tooltip.y }}
              className="absolute -translate-x-1/2 -translate-y-[calc(100%+14px)] bg-ink-900/95 text-white text-xs px-3.5 py-2.5 rounded-xl pointer-events-none shadow-card z-20 whitespace-nowrap"
            >
              <div className="font-semibold">{tooltip.name}</div>
              {tooltip.value != null ? (
                <div className="text-brand-300">{tooltip.value.toLocaleString()} {tooltip.unit}</div>
              ) : (
                <div className="text-ink-400">No data</div>
              )}
              {/* Little downward pointer */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-ink-900/95 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating toolbar */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md flex flex-wrap items-end gap-3 bg-white/90 dark:bg-ink-900/90 backdrop-blur-md rounded-2xl shadow-card border border-ink-100 dark:border-ink-800 p-4 z-10">
          <div>
            <label className="text-[11px] font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide block mb-1">Metric</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {METRICS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide block mb-1">Year</label>
            {yearsWithData.length > 1 ? (
              <div className="flex rounded-lg border border-ink-200 dark:border-ink-700 overflow-hidden">
                {yearsWithData.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`px-3 py-1.5 text-sm font-semibold transition ${
                      y === year
                        ? "bg-brand-600 text-white"
                        : "bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 text-sm font-semibold">
                {year || "—"}
              </div>
            )}
          </div>
          <p className="w-full text-[11px] text-ink-400 dark:text-ink-500">
            {otherYear
              ? `Comparing against ${otherYear} — hover a state to see the trend.`
              : "Latest state-level assessment available."}
          </p>
        </div>

        {/* Floating legend + rankings panel */}
        {panelOpen && (
          <div className="absolute top-16 right-4 w-64 sm:w-72 max-h-[calc(100%-5rem)] flex flex-col gap-3 z-10">
            <div className="bg-white/95 dark:bg-ink-900/95 backdrop-blur-md rounded-2xl shadow-card border border-ink-100 dark:border-ink-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300">
                  {metricLabel} <span className="text-ink-400 dark:text-ink-500 font-normal">({scale.unit})</span>
                </h3>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="sm:hidden text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="h-3 rounded-full mb-2" style={{
                background: "linear-gradient(to right, rgb(239,68,68), rgb(34,166,163))"
              }} />
              <div className="flex justify-between text-xs text-ink-500 dark:text-ink-400">
                <span>{scale.low.toLocaleString()}</span>
                <span>{scale.high.toLocaleString()}</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-400">
                <span className="inline-block w-3 h-3 rounded-sm shrink-0" style={{ background: "#e2e8f0" }} />
                No data available
              </div>
            </div>

            <div className="bg-white/95 dark:bg-ink-900/95 backdrop-blur-md rounded-2xl shadow-card border border-ink-100 dark:border-ink-800 p-4 overflow-y-auto scrollbar-thin flex-1 min-h-0">
              <RankingGroup title="States" rows={states} unit={scale.unit} trendFor={trendFor} />
              <RankingGroup title="Union Territories" rows={uts} unit={scale.unit} trendFor={trendFor} className="mt-4" />
              {states.length === 0 && uts.length === 0 && !loading && (
                <p className="text-xs text-ink-400 text-center py-4">No data for this selection</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RankingGroup({ title, rows, unit, trendFor, className = "" }) {
  if (rows.length === 0) return null;
  return (
    <div className={className}>
      <h4 className="text-[11px] font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide mb-2">{title}</h4>
      {rows.map(([state, d], i) => {
        const trend = trendFor(state);
        return (
          <div key={state} className="flex items-center gap-2 py-1.5 border-b border-ink-50 dark:border-ink-800 last:border-0">
            <span className="text-xs font-bold text-brand-500 w-5 shrink-0">{i + 1}</span>
            <span className="flex-1 min-w-0 text-xs text-ink-700 dark:text-ink-300 truncate">
              {titleCase(state)}
            </span>
            {trend && (
              <span className={`flex items-center gap-0.5 text-[10px] font-semibold shrink-0 ${trend.up ? "text-emerald-500" : "text-rose-500"}`}>
                {trend.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {Math.abs(trend.pct).toFixed(0)}%
              </span>
            )}
            <span className="text-xs text-ink-500 dark:text-ink-400 shrink-0">
              {d.value?.toLocaleString()} {unit}
            </span>
          </div>
        );
      })}
    </div>
  );
}
