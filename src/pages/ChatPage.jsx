import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, Map, BarChart3, Volume2, VolumeX, Trash2, Plus,
  TrendingUp, Wheat, SlidersHorizontal, MapPin, FileText, ChevronRight, AlertTriangle,
} from 'lucide-react';
import { api } from '../services/api';
import { LANGUAGES, USER_ROLES } from '../config/constants';
import { ROLE_ICONS } from '../config/icons';
import { useLanguage } from '../hooks/useLanguage';
import RoleSelector from '../components/chat/RoleSelector';
import QuickQueries from '../components/chat/QuickQueries';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import StatusIndicator from '../components/common/StatusIndicator';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import WaveDivider from '../components/home/WaveDivider';

const SPEECH_LOCALES = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
};

const ACTIONS = [
  { to: '/compare', key: 'compare', icon: BarChart3 },
  { to: '/forecast', key: 'forecast', icon: TrendingUp },
  { to: '/advisory', key: 'advisory', icon: Wheat },
  { to: '/simulator', key: 'simulator', icon: SlidersHorizontal },
  { to: '/field-data', key: 'fieldData', icon: MapPin },
  { to: '/reports', key: 'reports', icon: FileText },
];

export default function ChatPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState([
    { role: 'bot', content: t('greeting'), timestamp: new Date().toLocaleTimeString() },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [selectedLanguage] = useLanguage();
  const [selectedRole, setSelectedRole] = useState('general');
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [hasUserSent, setHasUserSent] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(false);
  const messagesEndRef = useRef(null);

  const activeRole = USER_ROLES.find((r) => r.id === selectedRole);
  const RoleIcon = activeRole ? ROLE_ICONS[activeRole.icon] : null;
  const activeLanguageName = LANGUAGES.find((l) => l.code === selectedLanguage)?.name;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Click-to-chat: MapPage/ComparePage can navigate here with a pre-filled query
  useEffect(() => {
    const initialQuery = location.state?.initialQuery;
    if (initialQuery) {
      handleSend(initialQuery);
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  function addMessage(role, content, extras = {}) {
    setMessages((prev) => [
      ...prev,
      { role, content, timestamp: new Date().toLocaleTimeString(), ...extras },
    ]);
  }

  function recentHistory() {
    // Last 5 turns as {role: 'user'|'assistant', content} for follow-up context
    return messages
      .filter((m) => m.role === 'user' || m.role === 'bot')
      .slice(-5)
      .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));
  }

  async function handleSend(text) {
    setHasUserSent(true);
    addMessage('user', text);
    setIsTyping(true);
    setStreamingContent('');
    const history = recentHistory();

    try {
      let accumulated = '';
      await new Promise((resolve, reject) => {
        api.chatStream(
          text,
          selectedRole,
          selectedLanguage,
          (token) => {
            accumulated += token;
            setStreamingContent(accumulated);
          },
          (finalData) => {
            setStreamingContent('');
            setIsTyping(false);
            addMessage('bot', finalData.final_answer || accumulated, {
              sources: finalData.sources,
              chart: finalData.chart,
              query: text,
            });
            if (voiceOutput) speak(finalData.final_answer || accumulated);
            resolve();
          },
          (err) => {
            reject(typeof err === 'string' ? new Error(err) : err);
          },
          history
        );
      });
    } catch {
      // SSE failed — fall back to standard POST
      try {
        const data = await api.chat(text, selectedRole, selectedLanguage, history);
        addMessage('bot', data.final_answer || 'Sorry, I could not generate an answer.', {
          sources: data.sources,
          chart: data.chart,
          query: text,
        });
        if (voiceOutput) speak(data.final_answer);
      } catch (e) {
        addMessage('bot', `Error: ${e.message || 'Could not connect to server.'}`);
      } finally {
        setStreamingContent('');
        setIsTyping(false);
      }
    }
  }

  function speak(text) {
    if (!('speechSynthesis' in window) || !text) return;
    const synth = window.speechSynthesis;

    const say = () => {
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = SPEECH_LOCALES[selectedLanguage] || 'en-IN';
      const voice = synth.getVoices().find((v) => v.lang === utter.lang)
        || synth.getVoices().find((v) => v.lang?.startsWith(selectedLanguage));
      if (voice) utter.voice = voice;
      synth.speak(utter);
    };

    // Chrome loads voices asynchronously; calling speak() before they're
    // ready silently produces no audio, so wait for the first load.
    if (synth.getVoices().length === 0) {
      synth.addEventListener('voiceschanged', say, { once: true });
    } else {
      say();
    }
  }

  function clearChat() {
    setMessages([
      { role: 'bot', content: t('chatCleared') || 'Chat cleared. How can I help you?', timestamp: new Date().toLocaleTimeString() },
    ]);
    setHasUserSent(false);
    setStreamingContent('');
  }

  return (
    <div className="flex flex-col h-screen bg-ink-50 dark:bg-ink-950">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 shadow-card z-20 shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition shrink-0"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => navigate('/')}
              title="Jalmitra home"
              className="flex items-center gap-3 min-w-0 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-black ring-1 ring-white/10 flex items-center justify-center shrink-0 p-1.5">
                <img src="/logo.png" alt="Jalmitra" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-lg sm:text-xl font-bold text-white leading-tight tracking-tight truncate">JALMITRA</h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">{t('nav.subtitle')}</p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div
              title="Jalmitra's dataset currently covers a limited set of states and years (2023–2024, district-level detail for Kerala only). Some queries may return incomplete or unavailable data."
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 text-white rounded-full text-xs sm:text-sm font-semibold shadow-soft"
            >
              <AlertTriangle size={14} className="shrink-0" />
              <span className="hidden sm:inline">Limited data coverage</span>
            </div>
            <div className="hidden lg:block" title="Backend connection status"><StatusIndicator /></div>
            <div className="hidden lg:block w-px h-5 bg-white/20 mx-1" />
            <button
              onClick={() => navigate('/map')}
              title="Open the interactive groundwater map of India"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition"
            >
              <Map size={14} />
              <span className="hidden sm:inline">{t('nav.map')}</span>
            </button>
            <button
              onClick={() => navigate('/visualization')}
              title="Build charts and visualize groundwater datasets"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition"
            >
              <BarChart3 size={14} />
              <span className="hidden sm:inline">{t('nav.visualize')}</span>
            </button>
            <div className="hidden sm:block w-px h-5 bg-white/20 mx-1" />
            <button
              onClick={() => setVoiceOutput((v) => !v)}
              title={voiceOutput ? 'Spoken responses on (English only) — click to mute' : 'Read answers aloud when Jalmitra replies — English only for now'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                voiceOutput ? 'bg-white text-brand-700' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {voiceOutput ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="hidden sm:inline">{t('nav.voice')}</span>
            </button>
            <LanguageSwitcher className="text-white" />
          </div>
        </div>
        <WaveDivider position="bottom" fillClassName="fill-ink-50 dark:fill-ink-950" duration={26} className="!h-3 opacity-60" />
      </header>

      <div className="flex flex-1 min-h-0 relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-ink-950/50 z-20 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-72 shrink-0 overflow-hidden bg-white dark:bg-ink-900 border-r border-ink-100 dark:border-ink-800 transition-all duration-300 ${
            sidebarOpen ? 'translate-x-0 lg:w-72' : '-translate-x-full lg:translate-x-0 lg:w-0'
          }`}
        >
          <div className="w-72 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
              <button
                onClick={clearChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-soft transition"
              >
                <Plus size={16} />
                {t('sidebar.newChat')}
              </button>

              <div className="mb-6">
                <h3 className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-3">{t('sidebar.yourRole')}</h3>
                <RoleSelector selected={selectedRole} onChange={setSelectedRole} />
              </div>

              <div>
                <h3 className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-3">{t('sidebar.explore')}</h3>
                <div className="flex flex-col gap-1">
                  {ACTIONS.map(({ to, key, icon: Icon }) => (
                    <button
                      key={to}
                      onClick={() => {
                        navigate(to);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700 dark:hover:text-brand-400 transition"
                    >
                      <Icon size={16} className="text-brand-600 dark:text-brand-400 shrink-0" />
                      {t(`actions.${key}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 p-3 border-t border-ink-100 dark:border-ink-800">
              <button
                onClick={() => navigate('/about')}
                title="About Jalmitra & VioniX"
                className="group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-800 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center shrink-0 overflow-hidden">
                  <img src="/logo.png" alt="" className="w-full h-full object-contain p-1" />
                </div>
                <span className="flex-1 min-w-0 text-left text-xs font-semibold text-ink-600 dark:text-ink-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition truncate">
                  Jalmitra <span className="text-ink-400 dark:text-ink-500 font-medium">&times; VioniX</span>
                </span>
                <ChevronRight size={14} className="text-ink-300 dark:text-ink-600 group-hover:text-brand-500 group-hover:translate-x-0.5 transition shrink-0" />
              </button>
            </div>
          </div>
        </aside>

        {/* Chat Main */}
        <main className="flex-1 flex flex-col min-w-0">
          {!hasUserSent ? (
            <div className="flex-1 overflow-y-auto scrollbar-thin flex items-center justify-center px-4 sm:px-6 py-10">
              <div className="max-w-3xl w-full mx-auto text-center animate-fade-in">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-3xl bg-brand-500/25 blur-2xl" aria-hidden="true" />
                  <div className="relative w-full h-full rounded-3xl bg-black shadow-card ring-1 ring-white/10 flex items-center justify-center p-4">
                    <img src="/logo.png" alt="" className="w-full h-full object-contain" />
                  </div>
                </div>

                <h2 className="font-display text-2xl sm:text-[28px] font-bold text-ink-900 dark:text-white mb-2.5 tracking-tight">
                  {t('heroTitle')}
                </h2>
                <p className="text-sm text-ink-500 dark:text-ink-400 max-w-lg mx-auto mb-8 leading-relaxed">
                  {t('greeting')}
                </p>

                <QuickQueries visible onSelect={handleSend} />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-ink-100 dark:border-ink-800">
                  <div className="flex items-center gap-2 text-xs font-medium text-ink-500 dark:text-ink-400 min-w-0">
                    {RoleIcon && <RoleIcon size={13} className="text-brand-600 dark:text-brand-400 shrink-0" />}
                    <span className="truncate">
                      {t('sidebar.chattingAs')} <strong className="text-ink-700 dark:text-ink-200 font-semibold">{activeRole && t(`roles.${activeRole.id}.title`)}</strong>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-ink-300 dark:bg-ink-600 shrink-0" />
                    <span className="shrink-0">{activeLanguageName}</span>
                  </div>
                  <button
                    onClick={clearChat}
                    className="flex items-center gap-1.5 text-xs font-medium text-ink-400 hover:text-rose-500 transition shrink-0"
                  >
                    <Trash2 size={13} />
                    {t('sidebar.clear')}
                  </button>
                </div>

                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} />
                ))}

                {/* Streaming preview */}
                {isTyping && streamingContent && (
                  <div className="flex justify-start mb-4">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white mr-2 shrink-0 mt-1 p-1.5">
                      <img src="/logo.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-sm bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 shadow-soft border border-ink-100 dark:border-ink-700 text-sm whitespace-pre-wrap">
                      {streamingContent}
                      <span className="inline-block w-1 h-4 ml-0.5 bg-brand-500 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Typing indicator (before first token) */}
                {isTyping && !streamingContent && (
                  <div className="flex justify-start mb-4">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white mr-2 shrink-0 mt-1 p-1.5">
                      <img src="/logo.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-soft">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-ink-400">{t('thinking')}</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          <div className="shrink-0 px-4 sm:px-6 pb-3 pt-1">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={handleSend} disabled={isTyping} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
