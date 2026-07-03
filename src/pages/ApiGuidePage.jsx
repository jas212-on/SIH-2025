import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, Copy, Check, ExternalLink, Zap, ShieldAlert } from 'lucide-react';
import WaveDivider from '../components/home/WaveDivider';
import { Reveal, RevealGroup, RevealItem } from '../components/home/Reveal';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ENDPOINT_GROUPS = [
  {
    group: 'Chat',
    endpoints: [
      { method: 'POST', path: '/chat', desc: 'Single-turn question → answer, with sources and role/language metadata.', body: `{
  "query": "What is the groundwater availability in Kerala?",
  "role": "farmer",
  "language": "en",
  "history": []
}` },
      { method: 'POST', path: '/chat/stream', desc: 'Same as /chat, streamed as Server-Sent Events (token, then a final done event).' },
      { method: 'GET', path: '/api/v1/suggestions?q=', desc: 'Query autocomplete suggestions.' },
      { method: 'POST', path: '/api/v1/feedback', desc: 'Submit a rating/comment on a chat answer.' },
    ],
  },
  {
    group: 'Visualization & Data',
    endpoints: [
      { method: 'POST', path: '/visualize', desc: 'Generate chart-ready data for a state/district/yearly/metric comparison.' },
      { method: 'GET', path: '/visualization/options', desc: 'All available states, districts, metrics, and years.' },
      { method: 'GET', path: '/api/v1/states', desc: 'List all states.' },
      { method: 'GET', path: '/api/v1/states/{state}/districts', desc: 'Districts for a given state.' },
      { method: 'GET', path: '/api/v1/metrics', desc: 'All metric definitions (rainfall, recharge, draft, availability, groundwater).' },
      { method: 'GET', path: '/api/v1/map/states?metric=&year=', desc: 'Per-state values for the India choropleth map.' },
      { method: 'GET', path: '/api/v1/data/freshness', desc: 'Timestamp of the most recent data ingest.' },
      { method: 'GET', path: '/api/v1/data/categories', desc: 'Available data categories for full export.' },
      { method: 'POST', path: '/api/v1/data/export', desc: 'Filtered CSV export for a comparison.' },
      { method: 'GET', path: '/api/v1/data/export-full', desc: 'Full dataset export (JSON or CSV) for a state/district/year range.' },
      { method: 'GET', path: '/api/v1/data/pinecone-export', desc: 'Export the raw semantic-search corpus for a state.' },
    ],
  },
  {
    group: 'Forecast & Simulator',
    endpoints: [
      { method: 'GET', path: '/api/v1/forecast/{state}?horizon=3', desc: 'Stage-of-extraction forecast for a state.' },
      { method: 'GET', path: '/api/v1/forecast/{state}/{district}?horizon=3', desc: 'Same, scoped to a district.' },
      { method: 'POST', path: '/api/v1/simulate', desc: 'What-if projection given a draft-change percentage.', body: `{
  "state": "KERALA",
  "district": "KOTTAYAM",
  "draft_change_pct": -15,
  "horizon": 5
}` },
    ],
  },
  {
    group: 'Advisory & Alerts',
    endpoints: [
      { method: 'POST', path: '/api/v1/advisory', desc: 'Farmer sowing/irrigation recommendation for a state/district/crop.' },
      { method: 'GET', path: '/api/v1/advisory/crops', desc: 'List of supported crops and their water-requirement profiles.' },
      { method: 'POST', path: '/api/v1/alerts/subscribe', desc: 'Subscribe an email to threshold alerts for a state/district.' },
      { method: 'POST', path: '/api/v1/alerts/unsubscribe', desc: 'Unsubscribe from alerts.' },
      { method: 'GET', path: '/api/v1/alerts/subscriptions', desc: 'List active subscriptions.' },
      { method: 'POST', path: '/api/v1/alerts/check', desc: 'Manually trigger a threshold check (normally scheduled).' },
    ],
  },
  {
    group: 'Field Data, Reports & Satellite',
    endpoints: [
      { method: 'POST', path: '/api/v1/field-observations', desc: 'Submit a crowdsourced well-depth reading.' },
      { method: 'GET', path: '/api/v1/field-observations', desc: 'List field observations for a state/district.' },
      { method: 'GET', path: '/api/v1/reports/{state}', desc: 'Generate a PDF report for a state across a year range.' },
      { method: 'GET', path: '/api/v1/reports/{state}/{district}', desc: 'Same, scoped to a district.' },
      { method: 'GET', path: '/api/v1/satellite/{state}?year=2024', desc: 'Satellite-derived vegetation/soil-moisture overlay.' },
    ],
  },
  {
    group: 'System',
    endpoints: [
      { method: 'GET', path: '/', desc: 'API metadata.' },
      { method: 'GET', path: '/health', desc: 'Liveness check + Neo4j/Pinecone dependency status.' },
    ],
  },
];

const METHOD_COLORS = {
  GET: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1.5 rounded-lg text-ink-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition shrink-0"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function ApiGuidePage() {
  const navigate = useNavigate();
  const curlExample = `curl -X POST ${BASE_URL}/chat \\
  -H "Content-Type: application/json" \\
  -d '{"query": "Is groundwater in Kottayam safe?", "role": "farmer", "language": "en"}'`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white dark:from-ink-950 dark:via-ink-950 dark:to-ink-950">
      <header className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 shadow-card z-10">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/documentation')}
              title="Back to documentation"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <button onClick={() => navigate('/')} title="Jalmitra home" className="flex items-center gap-3 min-w-0 text-left">
              <div className="w-10 h-10 rounded-xl bg-black ring-1 ring-white/10 flex items-center justify-center shrink-0 p-1.5">
                <img src="/logo.png" alt="Jalmitra" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-lg sm:text-xl font-bold text-white leading-tight tracking-tight truncate">API Guide</h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">REST reference for the Jalmitra backend</p>
              </div>
            </button>
          </div>
          <a
            href={`${BASE_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-white text-brand-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-50 transition"
          >
            Swagger UI <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <WaveDivider position="bottom" fillClassName="fill-brand-50 dark:fill-ink-950" duration={26} className="!h-3 opacity-60" />
      </header>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Reveal>
            <Code2 className="w-10 h-10 text-brand-600 mx-auto mb-4" />
            <h2 className="font-display text-4xl font-bold text-ink-900 dark:text-white mb-4">API Guide</h2>
            <p className="text-lg text-ink-600 dark:text-ink-300 leading-relaxed max-w-2xl mx-auto">
              Every feature in Jalmitra is backed by a plain REST endpoint on the FastAPI server. No API key is
              required for read/query endpoints — everything below works with a simple <code className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-brand-600 text-sm">fetch</code> or <code className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-brand-600 text-sm">curl</code>.
            </p>
          </Reveal>
        </div>

        {/* Base info cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-5">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">Base URL</p>
            <p className="text-sm font-mono text-ink-800 dark:text-ink-200 break-all">{BASE_URL}</p>
          </div>
          <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-5">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">Auth</p>
            <p className="text-sm text-ink-800 dark:text-ink-200">None — public, read/write endpoints are rate-limited instead</p>
          </div>
          <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-5 flex items-start gap-2">
            <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">Rate limit</p>
              <p className="text-sm text-ink-800 dark:text-ink-200">30 requests / minute / IP on write and chat endpoints</p>
            </div>
          </div>
        </div>

        {/* Example request */}
        <div className="max-w-4xl mx-auto mb-16">
          <Reveal>
            <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-3">Example request</h3>
            <div className="bg-ink-950 rounded-xl p-5 overflow-x-auto relative">
              <pre className="text-xs sm:text-sm text-emerald-300 font-mono whitespace-pre-wrap">{curlExample}</pre>
              <div className="absolute top-3 right-3">
                <CopyButton text={curlExample} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Endpoint reference */}
        <div className="max-w-4xl mx-auto space-y-12">
          {ENDPOINT_GROUPS.map((g) => (
            <Reveal key={g.group}>
              <h3 className="font-display text-2xl font-bold text-ink-900 dark:text-white mb-4">{g.group}</h3>
              <RevealGroup className="space-y-3">
                {g.endpoints.map((e) => (
                  <RevealItem key={e.method + e.path}>
                    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md shrink-0 ${METHOD_COLORS[e.method]}`}>
                          {e.method}
                        </span>
                        <code className="text-sm font-mono text-ink-800 dark:text-ink-200 break-all">{e.path}</code>
                      </div>
                      <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">{e.desc}</p>
                      {e.body && (
                        <pre className="mt-3 text-xs font-mono text-ink-600 dark:text-ink-300 bg-ink-50 dark:bg-ink-800/60 rounded-lg p-3 overflow-x-auto">
                          {e.body}
                        </pre>
                      )}
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </Reveal>
          ))}
        </div>

        {/* Errors */}
        <div className="max-w-4xl mx-auto mt-16">
          <Reveal>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-6 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-ink-900 dark:text-white mb-1">Error format</h4>
                <p className="text-sm text-ink-600 dark:text-ink-400">
                  All error responses return JSON as <code className="px-1 py-0.5 rounded bg-white dark:bg-ink-800 text-xs">{'{"detail": "message"}'}</code> with
                  a standard HTTP status code. Exceeding the rate limit returns <code className="px-1 py-0.5 rounded bg-white dark:bg-ink-800 text-xs">429</code>.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="max-w-4xl mx-auto mt-10 text-center">
          <a
            href={`${BASE_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold hover:gap-3 transition-all"
          >
            Explore the full interactive Swagger docs <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
