import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BarChart3, Globe2, MessageSquare, Users,
  ArrowRight, Menu, X, TrendingUp, Map, Wheat,
} from 'lucide-react';
import FlowBackground from '../components/home/FlowBackground';
import WaveDivider from '../components/home/WaveDivider';
import RippleButton from '../components/home/RippleButton';
import { Reveal, RevealGroup, RevealItem } from '../components/home/Reveal';

const HomePage = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: MessageSquare,
      title: 'Natural Language Q&A',
      description: 'Ask complex questions about groundwater data in plain language and get instant, cited answers.',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Forecasting',
      description: 'Project stage-of-extraction trends years ahead using historical CGWB assessment data.',
    },
    {
      icon: Wheat,
      title: 'Farmer Advisory',
      description: 'Sowing and irrigation recommendations that combine groundwater stage with crop water needs.',
    },
    {
      icon: Map,
      title: 'Interactive Groundwater Map',
      description: 'A live, color-coded choropleth of every state and union territory — click any region to dig deeper.',
    },
  ];

  const stats = [
    { number: '28', suffix: '+', label: 'States & UTs Covered' },
    { number: '6000', suffix: '+', label: 'Assessment Units' },
    { number: '24/7', suffix: '', label: 'AI Assistance' },
    { number: '2', suffix: ' yrs', label: 'Historical Data' },
  ];

  const chatBubbles = [
    { side: 'left', text: "What's the groundwater status in Kerala?" },
    { side: 'right', text: "Kerala has 14 districts with varying groundwater conditions. Currently, 8 districts are in the 'Safe' category, 4 are 'Semi-Critical', and 2 require immediate attention..." },
    { side: 'left', text: 'Will Kottayam be over-exploited by 2027?' },
    { side: 'right', text: 'Based on current trends, Kottayam is projected to reach 92% stage-of-extraction by 2027...', icon: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white dark:from-ink-950 dark:via-ink-950 dark:to-ink-950">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-ink-950/90 backdrop-blur-md shadow-soft' : 'bg-transparent'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 relative">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl bg-black flex items-center justify-center p-1.5 shrink-0"
                animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img src="/logo.png" alt="Jalmitra" className="w-full h-full object-contain" />
              </motion.div>
              <div>
                <h1 className="font-display text-xl font-bold text-ink-900 dark:text-white leading-none">JALMITRA</h1>
                <p className="text-xs text-ink-500 dark:text-ink-400">Groundwater Intelligence</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              <button onClick={() => navigate('/features')} className="text-ink-600 dark:text-ink-300 hover:text-brand-600 transition-colors text-sm font-medium">Features</button>
              <button onClick={() => navigate('/about')} className="text-ink-600 dark:text-ink-300 hover:text-brand-600 transition-colors text-sm font-medium">About</button>
              <button onClick={() => navigate('/contact')} className="text-ink-600 dark:text-ink-300 hover:text-brand-600 transition-colors text-sm font-medium">Contact</button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/chat')}
                className="hidden md:block bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-700 transition-all duration-300"
              >
                Launch Assistant
              </button>

              <button className="md:hidden text-ink-700 dark:text-ink-200" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-ink-900/95 backdrop-blur-md border-t border-ink-100 dark:border-ink-800">
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => navigate('/features')} className="block w-full text-left text-ink-700 dark:text-ink-200 hover:text-brand-600">Features</button>
              <button onClick={() => navigate('/about')} className="block w-full text-left text-ink-700 dark:text-ink-200 hover:text-brand-600">About</button>
              <button onClick={() => navigate('/contact')} className="block w-full text-left text-ink-700 dark:text-ink-200 hover:text-brand-600">Contact</button>
              <button
                onClick={() => navigate('/chat')}
                className="w-full bg-brand-600 text-white px-6 py-3 rounded-full font-semibold"
              >
                Launch Assistant
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-28 px-4 sm:px-6 lg:px-8">
        <FlowBackground className="-z-10" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="text-center lg:text-left">


              <Reveal delay={0.1}>
                <h1 className="font-display text-5xl md:text-6xl font-bold text-ink-900 dark:text-white mb-6 leading-tight">
                  Know your water,
                  <br />
                  <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">before it runs out</span>
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-xl text-ink-600 dark:text-ink-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Jalmitra turns India's CGWB groundwater assessments into forecasts, alerts, and
                  role-specific recommendations — through natural conversation.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                  <RippleButton
                    onClick={() => navigate('/chat')}
                    className="bg-brand-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-brand-700 transition-colors duration-300 shadow-card flex items-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Start Chatting</span>
                    <ArrowRight className="w-5 h-5" />
                  </RippleButton>

                  <RippleButton
                    onClick={() => navigate('/map')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-ink-700 dark:text-ink-200 ring-2 ring-ink-200 dark:ring-ink-700 rounded-full hover:ring-brand-500 hover:text-brand-600 transition-colors duration-300"
                  >
                    Explore the Map
                  </RippleButton>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="relative flex justify-center lg:justify-end">
              <motion.img
                src="/hero.png"
                alt="Jalmitra groundwater intelligence — a data-driven farm, well, and status dashboard"
                className="w-full max-w-md lg:max-w-lg drop-shadow-2xl"
                animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </Reveal>
          </div>

          {/* Stats */}
          <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <RevealItem key={index} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-brand-600">
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-ink-500 dark:text-ink-400 text-sm md:text-base">{stat.label}</div>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Hero mockup */}
          <Reveal delay={0.15} className="relative">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 shadow-card">
              <div className="bg-white dark:bg-ink-900 rounded-2xl p-6 min-h-96">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-rose-400 rounded-full" />
                  <div className="w-3 h-3 bg-amber-400 rounded-full" />
                  <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                  <div className="flex-1 bg-ink-100 dark:bg-ink-800 rounded-full px-4 py-2 text-center text-ink-500 dark:text-ink-400 text-sm">
                    Jalmitra Assistant
                  </div>
                </div>

                <RevealGroup className="space-y-4">
                  {chatBubbles.map((b, i) => (
                    <RevealItem key={i}>
                      {b.side === 'left' ? (
                        <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4 max-w-xs">
                          <p className="text-brand-800 dark:text-brand-300 text-sm">{b.text}</p>
                        </div>
                      ) : (
                        <div className="bg-ink-50 dark:bg-ink-800 rounded-xl p-4 max-w-md ml-auto flex items-center gap-2">
                          {b.icon && <TrendingUp className="w-4 h-4 text-brand-600 shrink-0" />}
                          <p className="text-ink-700 dark:text-ink-200 text-sm">{b.text}</p>
                        </div>
                      )}
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            </div>
          </Reveal>
        </div>

        <WaveDivider
          position="bottom"
          fillClassName="fill-white dark:fill-ink-900"
          secondaryFillClassName="fill-brand-100 dark:fill-brand-900/40"
          duration={24}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="relative overflow-hidden py-24 bg-white dark:bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-ink-900 dark:text-white mb-4">
              Beyond a chatbot
            </h2>
            <p className="text-xl text-ink-600 dark:text-ink-300 max-w-3xl mx-auto">
              Farmers, policymakers, and researchers each get tools built for how they actually use groundwater data.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <RevealItem key={index} className="group bg-ink-50 dark:bg-ink-800/60 p-8 rounded-2xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors duration-300">
                  <div className="w-11 h-11 rounded-xl bg-brand-600/10 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-ink-600 dark:text-ink-400 text-sm leading-relaxed">{feature.description}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>

        <WaveDivider
          position="bottom"
          fillClassName="fill-brand-50 dark:fill-ink-950"
          duration={20}
        />
      </section>

      {/* About Section */}
      <section id="about" className="relative overflow-hidden py-24 bg-brand-50 dark:bg-ink-950">
        <div className="max-w-7xl mx-auto px-8 sm:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <h2 className="font-display text-4xl font-bold text-ink-900 dark:text-white mb-6">
                Grounded in real assessment data
              </h2>
              <div className="space-y-6 text-ink-600 dark:text-ink-300">
                <p className="text-lg leading-relaxed">
                  The Assessment of Dynamic Ground Water Resources of India is conducted annually by the
                  Central Ground Water Board (CGWB) and State/UT Ground Water Departments, under the
                  coordination of the Central Level Expert Group (CLEG).
                </p>
                <p className="text-lg leading-relaxed">
                  Jalmitra turns that assessment data into forecasts, alerts, and role-aware recommendations —
                  accessible through natural conversation in six Indian languages.
                </p>
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-brand-600 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-ink-900 dark:text-white mb-1">Who benefits?</h4>
                    <p>Farmers, policymakers, researchers, and the general public seeking groundwater insight.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <RevealGroup className="grid grid-cols-2 gap-6">
              <RevealItem className="bg-white dark:bg-ink-900 p-6 rounded-2xl shadow-soft">
                <Globe2 className="w-9 h-9 text-brand-600 mb-4" />
                <h4 className="font-semibold text-ink-900 dark:text-white mb-1">Pan-India Coverage</h4>
                <p className="text-ink-500 dark:text-ink-400 text-sm">All states and union territories</p>
              </RevealItem>
              <RevealItem className="bg-white dark:bg-ink-900 p-6 rounded-2xl shadow-soft">
                <BarChart3 className="w-9 h-9 text-brand-600 mb-4" />
                <h4 className="font-semibold text-ink-900 dark:text-white mb-1">Scientific Analysis</h4>
                <p className="text-ink-500 dark:text-ink-400 text-sm">Evidence-based categorization</p>
              </RevealItem>
              <RevealItem className="bg-white dark:bg-ink-900 p-6 rounded-2xl shadow-soft">
                <TrendingUp className="w-9 h-9 text-brand-600 mb-4" />
                <h4 className="font-semibold text-ink-900 dark:text-white mb-1">Predictive Forecasts</h4>
                <p className="text-ink-500 dark:text-ink-400 text-sm">Trend projections, not just history</p>
              </RevealItem>
              <RevealItem className="bg-white dark:bg-ink-900 p-6 rounded-2xl shadow-soft">
                <MessageSquare className="w-9 h-9 text-brand-600 mb-4" />
                <h4 className="font-semibold text-ink-900 dark:text-white mb-1">AI-Powered</h4>
                <p className="text-ink-500 dark:text-ink-400 text-sm">Graph + semantic retrieval, cited</p>
              </RevealItem>
            </RevealGroup>
          </div>
        </div>

        <WaveDivider
          position="bottom"
          fillClassName="fill-brand-600"
          duration={26}
        />
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-r from-brand-700 to-brand-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-4xl font-bold text-white mb-6">
              Ready to explore India's groundwater data?
            </h2>
            <p className="text-xl text-brand-100 mb-8 max-w-3xl mx-auto">
              Start a conversation with Jalmitra and get insights, forecasts, and recommendations
              tailored to your role.
            </p>
            <RippleButton
              onClick={() => navigate('/chat')}
              className="bg-white text-brand-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-brand-50 transition-colors duration-300 shadow-card inline-flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Launch Jalmitra</span>
              <ArrowRight className="w-5 h-5" />
            </RippleButton>
          </Reveal>
        </div>

        <WaveDivider
          position="bottom"
          fillClassName="fill-ink-950"
          duration={20}
        />
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-ink-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Jalmitra" className="w-8 h-8" />
                <span className="font-display text-xl font-bold">JALMITRA</span>
              </div>
              <p className="text-ink-400 text-sm">
                Making groundwater data accessible through intelligent conversations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Organization</h4>
              <div className="space-y-2 text-ink-400 text-sm">
                <p>Vionix</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-ink-400 text-sm">
                <a href="https://ingres.iith.ac.in/home" target="_blank" rel="noreferrer" className="block hover:text-white transition-colors">INGRES</a>
                <button onClick={() => navigate('/documentation')} className="block hover:text-white transition-colors">Documentation</button>
                <button onClick={() => navigate('/api-guide')} className="block hover:text-white transition-colors">API Guide</button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-ink-400 text-sm">
                <button onClick={() => navigate('/about')} className="block hover:text-white transition-colors">About</button>
                <button onClick={() => navigate('/contact')} className="block hover:text-white transition-colors">Contact</button>
              </div>
            </div>
          </div>

          <div className="border-t border-ink-800 mt-12 pt-8 text-center text-ink-400 text-sm">
            <p>&copy; 2026 Jalmitra — Vionix initiative.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
