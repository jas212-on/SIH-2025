import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Rocket, Network, Layers, Globe2, Code2, ShieldQuestion, ArrowRight, Cpu,
} from 'lucide-react';
import WaveDivider from '../components/home/WaveDivider';
import { Reveal, RevealGroup, RevealItem } from '../components/home/Reveal';
import { useScrollSpy } from '../hooks/useScrollSpy';

const SECTIONS = [
  {
    id: 'getting-started',
    icon: Rocket,
    title: 'Getting Started',
    body: [
      "Jalmitra has two moving parts: a React frontend (this app) and a FastAPI backend that runs the GraphRAG pipeline. In production they're deployed separately — the frontend talks to the backend over HTTPS via the VITE_API_URL environment variable.",
      'No account or sign-up is required to use any feature. Head to the chat page and ask a question like "What is the groundwater status in Kerala?" to see the full pipeline in action.',
    ],
  },
  {
    id: 'how-it-works',
    icon: Network,
    title: 'How the GraphRAG Pipeline Works',
    body: [
      'Every chat query goes through five steps: (1) language detection, so a question in Hindi or Malayalam is handled correctly; (2) a Cypher query against the Neo4j knowledge graph pulls structured relationships — state → district → year → metric; (3) optionally, the same query is embedded and matched against Pinecone for semantically similar assessment text; (4) result sets are merged into a single context; (5) Gemini synthesizes that context into a natural-language, cited answer.',
      "This design means Jalmitra doesn't hallucinate numbers the way a pure-LLM chatbot might — every figure it states traces back to either a graph relationship or a retrieved document, not the model's own memory. (Step 3 is an optional enhancement — see Deployment & Hosting for why it runs locally but not in the hosted demo.)",
    ],
  },
  {
    id: 'data-sources',
    icon: Layers,
    title: 'Data Sources & Coverage',
    body: [
      'The core dataset is the Assessment of Dynamic Ground Water Resources of India, published annually by the Central Ground Water Board (CGWB) and State/UT Ground Water Departments under the Central Level Expert Group (CLEG). Jalmitra currently covers the 2023 and 2024 assessment cycles across 28+ states and union territories.',
      'District-level granularity is currently available for Kerala only — widening this is an active priority, primarily through the crowdsourced Field Observations feature, which lets anyone submit a well-depth reading for their district.',
    ],
  },
  {
    id: 'deployment',
    icon: Cpu,
    title: 'Deployment & Hosting',
    body: [
      "Jalmitra's semantic-search layer (the Pinecone step above) is fully built and works locally, but it is intentionally switched off in the hosted demo. Embedding a query requires loading PyTorch and a sentence-transformer model into memory — together more than the 512MB RAM ceiling of the free-tier instance this demo runs on. Left on, the backend would be out-of-memory-killed the moment you sent a chat message.",
      'So the hosted deployment runs a leaner two-engine pipeline — the Neo4j knowledge graph plus Google Gemini — which stays comfortably within budget and still grounds every answer in real assessment data. The vector-search code path is gated behind a single environment flag (PINECONE_ACTIVATION); flip it on when self-hosting with ≥1GB of RAM to get the full three-engine GraphRAG experience. Nothing about the feature was removed — only deferred so the public demo stays online.',
    ],
  },
  {
    id: 'roles',
    icon: Globe2,
    title: 'Role-Aware Design',
    body: [
      'Every feature adapts to who is using it. Farmers get sowing/irrigation advisory built on crop water-requirement tables. Policymakers get the what-if simulator and PDF report generation for decisions that need to be handed upward. Researchers get cited answers and raw CSV/JSON export. The general public gets plain-language answers in six Indian languages.',
      'You choose your role from the sidebar in the Chat page at any time — it changes both the tone of chat answers and which quick-action shortcuts are surfaced. Chat also supports voice: speech-to-text input and spoken responses (English only) on browsers that support the Web Speech API.',
    ],
  },
  {
    id: 'api',
    icon: Code2,
    title: 'Using the API Directly',
    body: [
      'Everything the frontend does is available as a plain REST API — no API key or authentication is required for read endpoints. See the dedicated API Guide for the full endpoint reference, request/response schemas, and example requests.',
    ],
    cta: { label: 'Open API Guide', route: '/api-guide' },
  },
  {
    id: 'faq',
    icon: ShieldQuestion,
    title: 'Troubleshooting & FAQ',
    body: [
      '"The map/chat says data is temporarily unavailable" — Neo4j Aura\'s free tier pauses after a period of inactivity; when this happens the backend degrades gracefully (falling back to locally bundled JSON data) rather than failing outright, and resumes within a few seconds of the next request.',
      '"My question doesn\'t seem answered accurately" — try being specific about the state/district and year; Jalmitra is grounded in the 2023–2024 assessment and cannot answer questions about data it doesn\'t have.',
    ],
    cta: { label: 'Contact us', route: '/contact' },
  },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);

export default function DocumentationPage() {
  const navigate = useNavigate();
  const activeId = useScrollSpy(SECTION_IDS);

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
                <h1 className="font-display text-lg sm:text-xl font-bold text-white leading-tight tracking-tight truncate">Documentation</h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">How Jalmitra works, end to end</p>
              </div>
            </button>
          </div>
          <button
            onClick={() => navigate('/api-guide')}
            className="hidden sm:inline-flex bg-white text-brand-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-50 transition"
          >
            API Guide
          </button>
        </div>
        <WaveDivider position="bottom" fillClassName="fill-brand-50 dark:fill-ink-950" duration={26} className="!h-3 opacity-60" />
      </header>

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-14">
          <Reveal>
            <BookOpen className="w-10 h-10 text-brand-600 mx-auto mb-4" />
            <h2 className="font-display text-4xl font-bold text-ink-900 dark:text-white mb-4">Documentation</h2>
            <p className="text-lg text-ink-600 dark:text-ink-300 leading-relaxed">
              Everything you need to understand what Jalmitra is doing under the hood — from a first question in
              chat to calling the API directly.
            </p>
          </Reveal>
        </div>

        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[240px_1fr] lg:gap-10 xl:gap-14">
          {/* Mobile TOC — horizontal pills, hidden on desktop in favor of the sidebar */}
          <div className="lg:hidden mb-8 flex flex-wrap justify-center gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:border-brand-400 hover:text-brand-600 transition"
              >
                {s.title}
              </a>
            ))}
          </div>

          {/* Desktop sidebar — sticky, scroll-spy highlighted */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-500 mb-3 px-3">Contents</p>
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                const isActive = activeId === s.id;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-semibold'
                        : 'text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {s.title}
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <div className="min-w-0">
            <RevealGroup className="space-y-8">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <RevealItem key={s.id} id={s.id}>
                    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-8 shadow-soft scroll-mt-24">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-brand-600/10 flex items-center justify-center text-brand-600 shrink-0">
                          <Icon className="w-5.5 h-5.5" />
                        </div>
                        <h3 className="text-xl font-semibold text-ink-900 dark:text-white">{s.title}</h3>
                      </div>
                      <div className="space-y-3">
                        {s.body.map((p, i) => (
                          <p key={i} className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{p}</p>
                        ))}
                      </div>
                      {s.cta && (
                        <button
                          onClick={() => navigate(s.cta.route)}
                          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:gap-2.5 transition-all"
                        >
                          {s.cta.label} <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </div>
      </section>
    </div>
  );
}
