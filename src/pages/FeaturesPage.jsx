import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MessageSquare, Map, BarChart3, TrendingUp, Wheat, SlidersHorizontal,
  MapPin, FileText, Bell, Satellite, Globe2, Mic, ShieldCheck, Sparkles, ArrowRight,
} from 'lucide-react';
import WaveDivider from '../components/home/WaveDivider';
import { Reveal, RevealGroup, RevealItem } from '../components/home/Reveal';

const CORE_FEATURES = [
  {
    icon: MessageSquare,
    title: 'GraphRAG-Powered Chat',
    route: '/chat',
    status: 'Live',
    description:
      "Ask groundwater questions in plain language and get cited, role-aware answers. Jalmitra's dual-pipeline RAG combines a Neo4j knowledge graph (structured relationships between states, districts, years, and metrics) with Pinecone semantic search (vector similarity over assessment text), then has Gemini synthesize both into a single grounded answer — with follow-up conversational context and streaming responses.",
    points: [
      'Role-aware tone: farmer, policymaker, researcher, or general public',
      'Streaming Server-Sent Events for real-time token output',
      'Multilingual: English, हिंदी, తెలుగు, தமிழ், ಕನ್ನಡ, മലയാളം',
      'Conversational memory over the last 5 turns',
    ],
  },
  {
    icon: Map,
    title: 'Interactive Groundwater Map',
    route: '/map',
    status: 'Live',
    description:
      'A live, color-coded choropleth of every Indian state and union territory. Pick a metric — rainfall, recharge, draft, availability, or groundwater resources — and a year, and the map recolors instantly. Click any state to jump straight into a chat pre-filled with that region.',
    points: [
      'Pan-India coverage across 28+ states and UTs',
      'Safe / Semi-Critical / Critical / Over-Exploited status bands',
      'Click-to-chat: exploration flows directly into Q&A',
    ],
  },
  {
    icon: BarChart3,
    title: 'Comparative Data Visualization',
    route: '/compare',
    status: 'Live',
    description:
      'Build bar, line, pie, doughnut, and radar charts comparing states, districts, years, or multiple metrics side by side. Every chart is backed by live Cypher queries against the knowledge graph, not static exports — and every chart can be downloaded as PNG or the underlying data exported as CSV.',
    points: [
      'State, district, yearly-trend, and multi-metric comparison modes',
      'Chart.js-powered visuals with dark-mode support',
      'One-click CSV/PNG export for reports and presentations',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Predictive Forecasting',
    route: '/forecast',
    status: 'Live',
    description:
      "With only two years of assessment data (2023–2024), a heavyweight model like Prophet or an LSTM would be overfitting theatre — so Jalmitra uses transparent linear-trend extrapolation and is explicit about confidence given the short history. Forecasts project stage-of-extraction 1–3 years ahead per state or district, flagging exactly when a region is projected to cross into a worse risk band.",
    points: [
      'Stage-of-extraction projections with configurable horizon',
      'Explicit risk-band threshold crossing alerts (e.g. "over-exploited by 2027")',
      'Gemini-written plain-language narrative on top of the numbers',
    ],
  },
  {
    icon: Wheat,
    title: 'Farmer Advisory',
    route: '/advisory',
    status: 'Live',
    description:
      "A structured, form-driven recommendation engine — not another chat message. Combines groundwater stage-of-extraction and rainfall (pulled live from the graph) with public ICAR/CWC crop water-requirement reference tables to produce a sowing/irrigation recommendation card: crop, water-availability confidence, suggested action, and risk flag.",
    points: [
      'Rule-based, transparent recommendations (not a black-box model)',
      'Crop-specific sowing windows and irrigation dependency ratios',
      'Water-efficient alternative crop suggestions where relevant',
    ],
  },
  {
    icon: SlidersHorizontal,
    title: 'What-If Simulator',
    route: '/simulator',
    status: 'Live',
    description:
      'Adjust a slider — "reduce agricultural draft by 15%" — and watch the projected stage-of-extraction trajectory update over a multi-year horizon. Built on the same forecasting model as the Forecast page, this turns Jalmitra from a passive lookup tool into a policy-testing sandbox for questions like "what would it take to keep this district Safe?"',
    points: [
      'Adjustable draft-change percentage, -90% to +200%',
      'Instant visual comparison against the baseline projection',
      'Designed for policymakers evaluating intervention scenarios',
    ],
  },
  {
    icon: MapPin,
    title: 'Crowdsourced Field Observations',
    route: '/field-data',
    status: 'Live',
    description:
      'Official CGWB district-level detail currently only exists for Kerala — crowdsourcing is the fastest way to widen coverage without a new government data partnership. Anyone can submit a real-time well-depth reading for their state/district; submissions are stored as a distinct FieldObservation node in the graph, clearly separated from and labeled apart from official data.',
    points: [
      'No account required — lightweight per-IP rate limiting instead of full auth',
      'Clearly labeled "community-reported, unverified" to preserve data trust',
      'Closes the biggest gap in current data coverage',
    ],
  },
  {
    icon: FileText,
    title: 'PDF Report Generation',
    route: '/reports',
    status: 'Live',
    description:
      'Generate a shareable groundwater report for any state or district across a year range — charts, a Gemini-written narrative, and a full data table assembled into a downloadable PDF. Built for policymakers and researchers who need something to hand upward, not just a chat transcript.',
    points: [
      'Reuses the same data layer as CSV export for consistency',
      'Narrative section written by Gemini from the underlying numbers',
      'One click, no manual formatting required',
    ],
  },
  {
    icon: Bell,
    title: 'Early-Warning Alerts',
    route: '/chat',
    status: 'Live',
    description:
      'Subscribe to a district or state and get notified when new data pushes it across a risk threshold (e.g. stage-of-extraction crossing 100% into "over-exploited"). A scheduled backend job checks incoming data against thresholds and delivers alerts by email — this is the feature that turns Jalmitra from "ask when curious" into "tells you when it matters."',
    points: [
      'Threshold-based subscriptions per state/district',
      'SMTP email delivery, with console logging as a safe dev-mode fallback',
      'The core habit-forming loop a static dashboard lacks',
    ],
  },
  {
    icon: Satellite,
    title: 'Satellite Overlay',
    route: '/map',
    status: 'In progress',
    description:
      'A supplementary remote-sensing signal — vegetation index and soil-moisture readings — cross-referenced against groundwater graph data on the map view. The API contract is stable today with deterministic seeded data; swapping in a real Bhuvan (ISRO) or Google Earth Engine feed requires no frontend changes.',
    points: [
      'Stable endpoint contract ready for a live data source swap',
      'Cross-referenced against existing groundwater metrics',
    ],
  },
];

const ROLE_LENS = [
  { icon: Wheat, role: 'Farmers', focus: 'Sowing/irrigation advisory, simple language, voice-friendly design goals, crop-specific water guidance.' },
  { icon: ShieldCheck, role: 'Policymakers', focus: 'What-if simulation, forecasting, PDF reports, cross-district comparison for intervention planning.' },
  { icon: Sparkles, role: 'Researchers', focus: 'Cited answers, raw CSV/JSON export, transparent methodology (linear extrapolation, not a black box).' },
  { icon: Globe2, role: 'General Public', focus: 'Plain-language answers to "is my area\'s groundwater safe?" in six Indian languages.' },
];

export default function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white dark:from-ink-950 dark:via-ink-950 dark:to-ink-950">
      <header className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 shadow-card z-10">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/')}
              title="Back to home"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <button onClick={() => navigate('/')} title="Jalmitra home" className="flex items-center gap-3 min-w-0 text-left">
              <div className="w-10 h-10 rounded-xl bg-black ring-1 ring-white/10 flex items-center justify-center shrink-0 p-1.5">
                <img src="/logo.png" alt="Jalmitra" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-lg sm:text-xl font-bold text-white leading-tight tracking-tight truncate">Features</h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">Everything Jalmitra can do, in detail</p>
              </div>
            </button>
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="hidden sm:inline-flex bg-white text-brand-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-50 transition"
          >
            Launch Assistant
          </button>
        </div>
        <WaveDivider position="bottom" fillClassName="fill-brand-50 dark:fill-ink-950" duration={26} className="!h-3 opacity-60" />
      </header>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink-900 dark:text-white mb-6">
              Beyond a chatbot — a full decision-support platform
            </h2>
            <p className="text-lg text-ink-600 dark:text-ink-300 leading-relaxed">
              Jalmitra moves along one axis on every feature it ships: from <strong>describing</strong> the current
              situation, to <strong>monitoring</strong> it, <strong>forecasting</strong> what happens next,
              <strong> recommending</strong> an action, and finally <strong>alerting</strong> when something needs
              attention. Below is every feature that axis produced so far.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Feature grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <RevealGroup className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {CORE_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <RevealItem key={f.title}>
                  <div
                    onClick={() => navigate(f.route)}
                    className="group cursor-pointer h-full bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-7 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-600/10 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                          f.status === 'Live'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                      >
                        {f.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-ink-900 dark:text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed mb-4">{f.description}</p>
                    <ul className="space-y-1.5 mb-4">
                      {f.points.map((p) => (
                        <li key={p} className="text-sm text-ink-500 dark:text-ink-400 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-brand-500 mt-2 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-2.5 transition-all">
                      Try it <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Role lens */}
      <section className="py-20 bg-brand-50 dark:bg-ink-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white mb-3">Built differently for every role</h2>
            <p className="text-ink-600 dark:text-ink-300 max-w-2xl mx-auto">
              Role-awareness runs deeper than tone of voice — it shapes which features matter most to you.
            </p>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROLE_LENS.map((r) => {
              const Icon = r.icon;
              return (
                <RevealItem key={r.role} className="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-soft">
                  <Icon className="w-8 h-8 text-brand-600 mb-3" />
                  <h4 className="font-semibold text-ink-900 dark:text-white mb-1.5">{r.role}</h4>
                  <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{r.focus}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Roadmap note */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <Mic className="w-8 h-8 text-brand-600 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-ink-900 dark:text-white mb-3">Still on the roadmap</h3>
            <p className="text-ink-600 dark:text-ink-300 leading-relaxed">
              A full voice interface (speech-to-text input, text-to-speech output) and a real Bhuvan/Google Earth
              Engine satellite integration are planned next — the language-detection and translation layer that
              would power voice input is already part of the chat pipeline today.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
