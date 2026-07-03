import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Mic, Send } from "lucide-react";
import { api } from "../../services/api";

const SpeechRecognitionAPI =
  typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function ChatInput({ onSend, disabled }) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [listening, setListening] = useState(false);
  const debounceRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  function toggleListening() {
    if (!SpeechRecognitionAPI) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function handleChange(e) {
    const val = e.target.value;
    setText(val);
    clearTimeout(debounceRef.current);
    if (val.trim().length > 2) {
      debounceRef.current = setTimeout(async () => {
        try {
          const data = await api.suggestions(val);
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        } catch {}
      }, 350);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function pickSuggestion(s) {
    setText(s);
    setSuggestions([]);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  }

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  return (
    <div className="relative">
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl shadow-card overflow-hidden z-10 animate-slide-up">
          <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-ink-400 uppercase tracking-wide">{t('suggestions')}</div>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={(e) => { e.preventDefault(); pickSuggestion(s); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-brand-50 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-300 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1.5 border border-ink-200 dark:border-ink-700 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-brand-400 dark:focus-within:border-brand-500 transition">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={t('inputPlaceholder')}
          rows={1}
          className="flex-1 resize-none outline-none bg-transparent text-sm text-ink-800 dark:text-ink-100 placeholder-ink-400 max-h-32 overflow-y-auto py-1"
          style={{ height: "auto", minHeight: "20px" }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
          }}
        />
        {SpeechRecognitionAPI && (
          <button
            onClick={toggleListening}
            title={listening ? "Stop voice input" : "Speak your question"}
            type="button"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition shrink-0 ${
              listening ? "text-rose-500 animate-pulse" : "text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700"
            }`}
          >
            <Mic size={16} />
          </button>
        )}
        <button
          onClick={submit}
          disabled={!text.trim() || disabled}
          className="w-8 h-8 rounded-full bg-ink-900 dark:bg-white hover:bg-ink-700 dark:hover:bg-ink-200 disabled:bg-ink-200 dark:disabled:bg-ink-700 disabled:cursor-not-allowed flex items-center justify-center transition shrink-0"
        >
          <Send size={14} className="text-white dark:text-ink-900" />
        </button>
      </div>
      <p className="text-center text-[11px] text-ink-400 dark:text-ink-500 mt-1.5">
        {t('inputDisclaimer')}
      </p>
    </div>
  );
}
