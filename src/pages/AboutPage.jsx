import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Info, ScrollText, LifeBuoy, Mail, Droplet, Sparkles, ShieldCheck } from "lucide-react";
import LanguageSwitcher from "../components/common/LanguageSwitcher";

const TAB_IDS = ["about", "terms", "support"];
const TAB_ICONS = { about: Info, terms: ScrollText, support: LifeBuoy };

function AboutSection({ t }) {
  const features = t("about.features", { returnObjects: true });

  return (
    <div className="space-y-8">
      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900 dark:text-white mb-2.5">
          <Droplet size={17} className="text-brand-600" /> {t("about.whatIsTitle")}
        </h2>
        <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{t("about.whatIsBody")}</p>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900 dark:text-white mb-2.5">
          <Sparkles size={17} className="text-brand-600" /> {t("about.whatItDoesTitle")}
        </h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-sm text-ink-600 dark:text-ink-300">
          {features.map((item) => (
            <li key={item} className="flex items-start gap-2 bg-ink-50 dark:bg-ink-800/60 rounded-xl px-3.5 py-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900 dark:text-white mb-2.5">
          <ShieldCheck size={17} className="text-brand-600" /> {t("about.devTitle")}
        </h2>
        <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{t("about.devBody")}</p>
      </section>
    </div>
  );
}

function TermsSection({ t }) {
  const clauses = t("about.clauses", { returnObjects: true });

  return (
    <div className="space-y-5">
      <p className="text-xs text-ink-400 dark:text-ink-500 uppercase tracking-wide font-semibold">{t("about.lastUpdated")}</p>
      {clauses.map((c) => (
        <section key={c.title}>
          <h3 className="text-sm font-bold text-ink-900 dark:text-white mb-1">{c.title}</h3>
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{c.body}</p>
        </section>
      ))}
    </div>
  );
}

function SupportSection({ t }) {
  const faq = t("about.faq", { returnObjects: true });

  return (
    <div className="space-y-8">
      <section className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-5">
        <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
          <Mail size={18} className="text-white" />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-base font-bold text-ink-900 dark:text-white mb-1">{t("about.contactTitle")}</h2>
          <p className="text-sm text-ink-600 dark:text-ink-300 mb-2">{t("about.contactBody")}</p>
          <a
            href="mailto:vionix37@gmail.com"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-400 hover:underline"
          >
            vionix37@gmail.com
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-ink-900 dark:text-white mb-3">{t("about.faqTitle")}</h2>
        <div className="space-y-3">
          {faq.map((f) => (
            <details key={f.q} className="group bg-ink-50 dark:bg-ink-800/60 rounded-xl px-4 py-3">
              <summary className="cursor-pointer select-none text-sm font-semibold text-ink-800 dark:text-ink-100 list-none">
                {f.q}
              </summary>
              <p className="text-sm text-ink-600 dark:text-ink-300 mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function AboutPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tab, setTab] = useState("about");

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <div className="w-full max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-16 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate("/chat")}
            title="Back to chat"
            className="flex items-center gap-1.5 text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
          >
            <ArrowLeft size={13} />
            {t("backToChat")}
          </button>
          <LanguageSwitcher className="text-ink-600 dark:text-ink-300" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left column: brand + nav */}
          <aside className="md:w-60 shrink-0">
            <div className="md:sticky md:top-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-black shadow-card flex items-center justify-center p-2 shrink-0">
                  <img src="/logo.png" alt="Jalmitra" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-light text-ink-300 dark:text-ink-600">&times;</span>
                <div className="w-12 h-12 rounded-2xl bg-black shadow-card overflow-hidden ring-1 ring-ink-200 dark:ring-ink-700 shrink-0">
                  <img src="/vionix.jpg" alt="VioniX" className="w-full h-full object-cover" />
                </div>
              </div>
              <h1 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-1 tracking-tight">
                Jalmitra <span className="text-ink-400 dark:text-ink-500 font-normal">&times;</span> VioniX
              </h1>
              <p className="text-sm text-ink-500 dark:text-ink-400 mb-6 leading-relaxed">{t("about.tagline")}</p>

              <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
                {TAB_IDS.map((id) => {
                  const Icon = TAB_ICONS[id];
                  const active = tab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                        active
                          ? "bg-brand-600 text-white shadow-soft"
                          : "text-ink-600 dark:text-ink-300 hover:bg-white dark:hover:bg-ink-800 border border-transparent hover:border-ink-200 dark:hover:border-ink-700"
                      }`}
                    >
                      <Icon size={15} className={active ? "text-white" : "text-brand-600 dark:text-brand-400"} />
                      {t(`about.tabs.${id}`)}
                    </button>
                  );
                })}
              </nav>

              <p className="hidden md:block text-xs text-ink-400 dark:text-ink-500 mt-8">
                {t("about.footerLine1")}
                <br />
                {t("about.footerLine2")}
              </p>
            </div>
          </aside>

          {/* Right column: content */}
          <div className="flex-1 min-w-0 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-soft p-6 sm:p-8 animate-fade-in">
            {tab === "about" && <AboutSection t={t} />}
            {tab === "terms" && <TermsSection t={t} />}
            {tab === "support" && <SupportSection t={t} />}
          </div>
        </div>

        <p className="md:hidden text-center text-xs text-ink-400 dark:text-ink-500 mt-8">
          {t("about.footerLine1")} &middot; {t("about.footerLine2")}
        </p>
      </div>
    </div>
  );
}
