import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileText, ArrowLeft, Database, Sparkles, Download, CheckSquare, Square, FileJson, FileSpreadsheet } from "lucide-react";
import { api } from "../services/api";
import { ALL_STATES, KERALA_DISTRICTS, AVAILABLE_YEARS } from "../config/constants";
import { useToast } from "../components/common/Toast";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import WaveDivider from "../components/home/WaveDivider";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const [state, setState] = useState("KERALA");
  const [district, setDistrict] = useState("");
  const [years, setYears] = useState(AVAILABLE_YEARS);

  // PDF report
  const [pdfLoading, setPdfLoading] = useState(false);

  // Full Neo4j dataset export
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dataFormat, setDataFormat] = useState("json");
  const [dataLoading, setDataLoading] = useState(false);

  // Pinecone semantic export
  const [pineconeFormat, setPineconeFormat] = useState("json");
  const [pineconeLoading, setPineconeLoading] = useState(false);
  const [pineconePreview, setPineconePreview] = useState(null);

  useEffect(() => {
    api.dataCategories()
      .then((d) => {
        const list = d.categories || [];
        setCategories(list);
        setSelectedCategories(list.map((c) => c.id));
      })
      .catch(() => {});
  }, []);

  function toggleYear(y) {
    setYears((prev) => (prev.includes(y) ? prev.filter((x) => x !== y) : [...prev, y].sort()));
  }

  function toggleCategory(id) {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleAllCategories() {
    setSelectedCategories((prev) => (prev.length === categories.length ? [] : categories.map((c) => c.id)));
  }

  async function downloadPdf() {
    if (years.length === 0) { toast("Select at least one year", "warning"); return; }
    setPdfLoading(true);
    try {
      const res = await api.generateReport(state, district || undefined, years);
      if (!res.ok) throw new Error("Report generation failed");
      const blob = await res.blob();
      triggerDownload(blob, `jalmitra_report_${state}${district ? `_${district}` : ""}.pdf`);
      toast("Report downloaded", "success");
    } catch (e) {
      toast(e.message || "Report generation failed", "error");
    } finally {
      setPdfLoading(false);
    }
  }

  async function downloadFullDataset() {
    if (selectedCategories.length === 0) { toast("Select at least one data category", "warning"); return; }
    if (years.length === 0) { toast("Select at least one year", "warning"); return; }
    setDataLoading(true);
    try {
      if (dataFormat === "csv") {
        const res = await api.exportFullDataset({ state, district, years, categories: selectedCategories, format: "csv" });
        if (!res.ok) throw new Error("Export failed");
        const blob = await res.blob();
        triggerDownload(blob, `jalmitra_data_${state}${district ? `_${district}` : ""}.csv`);
      } else {
        const data = await api.exportFullDataset({ state, district, years, categories: selectedCategories, format: "json" });
        triggerDownload(
          new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
          `jalmitra_data_${state}${district ? `_${district}` : ""}.json`
        );
      }
      toast("Dataset exported", "success");
    } catch (e) {
      toast(e.message || "Export failed", "error");
    } finally {
      setDataLoading(false);
    }
  }

  async function loadPineconePreview() {
    try {
      const data = await api.exportPineconeData(state, "json");
      setPineconePreview(data.records?.[0] || null);
    } catch {
      setPineconePreview(null);
    }
  }

  useEffect(() => { loadPineconePreview(); }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  async function downloadPinecone() {
    setPineconeLoading(true);
    try {
      if (pineconeFormat === "csv") {
        const res = await api.exportPineconeData(state, "csv");
        if (!res.ok) throw new Error("Export failed");
        const blob = await res.blob();
        triggerDownload(blob, `jalmitra_semantic_${state}.csv`);
      } else {
        const data = await api.exportPineconeData(state, "json");
        triggerDownload(
          new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
          `jalmitra_semantic_${state}.json`
        );
      }
      toast("Semantic data exported", "success");
    } catch (e) {
      toast(e.message || "Export failed", "error");
    } finally {
      setPineconeLoading(false);
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
                  {t('pages.reports.title')}
                </h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">{t('pages.reports.subtitle')}</p>
              </div>
            </button>
          </div>
          <LanguageSwitcher className="text-white shrink-0" />
        </div>
        <WaveDivider position="bottom" fillClassName="fill-ink-50 dark:fill-ink-950" duration={26} className="!h-3 opacity-60" />
      </header>

      {/* Shared location/year toolbar */}
      <div className="bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 px-6 sm:px-10 lg:px-14 py-3">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-[11px] font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide block mb-1">State</label>
            <select value={state} onChange={(e) => { setState(e.target.value); setDistrict(""); }}
              className="px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              {ALL_STATES.map((s) => <option key={s} value={s}>{s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide block mb-1">District</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)}
              className="px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Whole state</option>
              {state === "KERALA" && KERALA_DISTRICTS.map((d) => <option key={d} value={d}>{d.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide block mb-1">Years</label>
            <div className="flex gap-1.5">
              {AVAILABLE_YEARS.map((y) => (
                <label key={y} className={`px-3 py-2 rounded-lg border text-sm font-semibold cursor-pointer transition ${years.includes(y) ? "bg-brand-600 text-white border-brand-600" : "border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300"}`}>
                  <input type="checkbox" className="hidden" checked={years.includes(y)} onChange={() => toggleYear(y)} />
                  {y}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-14 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PDF narrative report */}
          <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-brand-600/10 flex items-center justify-center text-brand-600 shrink-0">
                <FileText size={17} />
              </div>
              <h3 className="font-semibold text-ink-800 dark:text-ink-100">Narrative PDF Report</h3>
            </div>
            <p className="text-sm text-ink-500 dark:text-ink-400 mb-4 leading-relaxed">
              A polished PDF with an AI-written narrative summary plus a formatted data table for rainfall, recharge, draft, and availability — ready to share or print.
            </p>
            <button onClick={downloadPdf} disabled={pdfLoading}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-full shadow-soft transition text-sm">
              <Download size={14} />
              {pdfLoading ? "Generating..." : "Download PDF Report"}
            </button>
          </div>

          {/* Pinecone semantic export */}
          <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-600 shrink-0">
                <Sparkles size={17} />
              </div>
              <h3 className="font-semibold text-ink-800 dark:text-ink-100">Semantic Search Data (Pinecone)</h3>
            </div>
            <p className="text-sm text-ink-500 dark:text-ink-400 mb-3 leading-relaxed">
              The indexed text passages and metadata Jalmitra's chat assistant retrieves from — the same data behind every cited answer.
            </p>
            {pineconePreview && (
              <details className="mb-3 text-xs bg-ink-50 dark:bg-ink-900 rounded-lg p-3">
                <summary className="cursor-pointer font-medium text-ink-600 dark:text-ink-300">Preview a sample record</summary>
                <p className="mt-2 text-ink-500 dark:text-ink-400 whitespace-pre-wrap line-clamp-6">{pineconePreview.text?.slice(0, 400)}...</p>
              </details>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-ink-200 dark:border-ink-700 overflow-hidden">
                <button onClick={() => setPineconeFormat("json")} className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1 ${pineconeFormat === "json" ? "bg-purple-600 text-white" : "bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-300"}`}>
                  <FileJson size={12} /> JSON
                </button>
                <button onClick={() => setPineconeFormat("csv")} className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1 ${pineconeFormat === "csv" ? "bg-purple-600 text-white" : "bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-300"}`}>
                  <FileSpreadsheet size={12} /> CSV
                </button>
              </div>
              <button onClick={downloadPinecone} disabled={pineconeLoading}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-full shadow-soft transition text-sm">
                <Download size={14} />
                {pineconeLoading ? "Exporting..." : "Export Semantic Data"}
              </button>
            </div>
          </div>
        </div>

        {/* Full structured Neo4j export */}
        <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-sm border border-ink-100 dark:border-ink-700 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 shrink-0">
              <Database size={17} />
            </div>
            <h3 className="font-semibold text-ink-800 dark:text-ink-100">Full Structured Dataset (Neo4j)</h3>
          </div>
          <p className="text-sm text-ink-500 dark:text-ink-400 mb-4 leading-relaxed">
            Every category the groundwater graph stores for {state.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
            {district ? `, ${district.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}` : ""} — select exactly what you need and export it in a structured file.
          </p>

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide">Data categories</span>
            <button onClick={toggleAllCategories} className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline">
              {selectedCategories.length === categories.length ? <CheckSquare size={12} /> : <Square size={12} />}
              {selectedCategories.length === categories.length ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
            {categories.map((c) => (
              <label key={c.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition ${
                selectedCategories.includes(c.id)
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300"
                  : "border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:border-ink-300 dark:hover:border-ink-600"
              }`}>
                <input type="checkbox" className="hidden" checked={selectedCategories.includes(c.id)} onChange={() => toggleCategory(c.id)} />
                {selectedCategories.includes(c.id) ? <CheckSquare size={14} className="shrink-0" /> : <Square size={14} className="shrink-0 text-ink-300 dark:text-ink-600" />}
                <span className="truncate">{c.label}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-ink-200 dark:border-ink-700 overflow-hidden">
              <button onClick={() => setDataFormat("json")} className={`px-3 py-2 text-xs font-semibold flex items-center gap-1 ${dataFormat === "json" ? "bg-emerald-600 text-white" : "bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-300"}`}>
                <FileJson size={12} /> JSON
              </button>
              <button onClick={() => setDataFormat("csv")} className={`px-3 py-2 text-xs font-semibold flex items-center gap-1 ${dataFormat === "csv" ? "bg-emerald-600 text-white" : "bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-300"}`}>
                <FileSpreadsheet size={12} /> CSV
              </button>
            </div>
            <button onClick={downloadFullDataset} disabled={dataLoading}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-full shadow-soft transition text-sm">
              <Download size={14} />
              {dataLoading ? "Exporting..." : `Export ${selectedCategories.length} categor${selectedCategories.length === 1 ? "y" : "ies"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
