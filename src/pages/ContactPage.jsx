import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Info, MessageSquare, HelpCircle, Code2 } from 'lucide-react';
import WaveDivider from '../components/home/WaveDivider';
import { Reveal, RevealGroup, RevealItem } from '../components/home/Reveal';

const FAQS = [
  {
    q: 'Is Jalmitra affiliated with the government?',
    a: 'No. Jalmitra is an independent project built by Vionix that uses publicly available CGWB (Central Ground Water Board) and Ministry of Jal Shakti assessment data. It is not an official government product.',
  },
  {
    q: 'How current is the data?',
    a: 'The knowledge graph currently covers the 2023–2024 CGWB assessment cycle, with district-level detail for Kerala. Coverage is expanding through crowdsourced field observations — see the Features page.',
  },
  {
    q: 'Can I use Jalmitra\'s data or API for my own project?',
    a: 'The underlying CGWB data is public, and every feature is backed by a plain REST API — see the API Guide for the full reference. Reach out at the email below if you want to discuss access, exports, or collaboration.',
  },
  {
    q: 'I found a bug or have a feature request — where do I report it?',
    a: 'Email us directly using the contact card below with a description of the issue and, if possible, the steps to reproduce it.',
  },
];

export default function ContactPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

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
                <h1 className="font-display text-lg sm:text-xl font-bold text-white leading-tight tracking-tight truncate">Contact</h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">Get in touch with the Jalmitra team</p>
              </div>
            </button>
          </div>
        </div>
        <WaveDivider position="bottom" fillClassName="fill-brand-50 dark:fill-ink-950" duration={26} className="!h-3 opacity-60" />
      </header>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <Reveal>
            <h2 className="font-display text-4xl font-bold text-ink-900 dark:text-white mb-4">We'd love to hear from you</h2>
            <p className="text-lg text-ink-600 dark:text-ink-300 leading-relaxed">
              Questions about the data, partnership ideas, bug reports, or just feedback on the assistant — reach
              out through any of the channels below.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <RevealItem>
            <a
              href="mailto:vionix37@gmail.com"
              className="group flex flex-col items-center text-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-8 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-600/10 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-ink-900 dark:text-white mb-1">Email</h3>
              <p className="text-sm text-brand-600 dark:text-brand-400 break-all">vionix37@gmail.com</p>
            </a>
          </RevealItem>

          <RevealItem>
            <button
              onClick={() => navigate('/about')}
              className="group w-full flex flex-col items-center text-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-8 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-600/10 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
                <Info className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-ink-900 dark:text-white mb-1">About Jalmitra</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400">Mission, data sources, and the team behind it</p>
            </button>
          </RevealItem>

          <RevealItem>
            <button
              onClick={() => navigate('/chat')}
              className="group w-full flex flex-col items-center text-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-8 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-600/10 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-ink-900 dark:text-white mb-1">Ask the Assistant</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400">Fastest way to get a data-backed answer</p>
            </button>
          </RevealItem>

          <RevealItem>
            <button
              onClick={() => navigate('/api-guide')}
              className="group w-full flex flex-col items-center text-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-8 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-600/10 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-ink-900 dark:text-white mb-1">API Guide</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400">Build against Jalmitra's REST endpoints directly</p>
            </button>
          </RevealItem>
        </RevealGroup>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-10">
            <HelpCircle className="w-8 h-8 text-brand-600 mx-auto mb-3" />
            <h3 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Frequently Asked Questions</h3>
          </Reveal>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium text-ink-900 dark:text-white text-sm">{f.q}</span>
                  <span className="text-brand-600 text-xl leading-none shrink-0">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-4 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-ink-950 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-ink-400 text-sm">
          <span>&copy; 2026 Jalmitra — Vionix initiative.</span>
        </div>
      </footer>
    </div>
  );
}
