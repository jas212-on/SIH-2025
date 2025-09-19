import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Database, BarChart3, Globe, MessageSquare, Users, Zap, ArrowRight, Menu, X } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Intelligent Query Handling",
      description: "Ask complex questions about groundwater data in natural language and get instant, accurate responses."
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Real-time Data Access",
      description: "Access current and historical groundwater assessment results with seamless database integration."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Interactive Visualizations",
      description: "Generate scientific diagrams and charts to better understand groundwater patterns and trends."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multilingual Support",
      description: "Available in multiple Indian regional languages to serve diverse user communities."
    }
  ];

  const stats = [
    { number: "28", label: "States & UTs Covered", suffix: "+" },
    { number: "6000", label: "Assessment Units", suffix: "+" },
    { number: "24/7", label: "AI Assistance", suffix: "" },
    { number: "50", label: "Years of Data", suffix: "+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">INGRES AI</h1>
                <p className="text-xs text-gray-600">ChatBOT</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              <button 
                onClick={() => navigate('/chat')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105">
                Try ChatBOT
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-blue-600">Features</a>
              <a href="#about" className="block text-gray-700 hover:text-blue-600">About</a>
              <a href="#contact" className="block text-gray-700 hover:text-blue-600">Contact</a>
              <button 
                onClick={() => navigate('/chat')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full">
                Try ChatBOT
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>Powered by Advanced AI Technology</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                INGRES AI
              </span>
              <br />
              <span className="text-gray-800">ChatBOT</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your intelligent virtual assistant for India's groundwater resources. Access comprehensive data, 
              historical assessments, and real-time insights through natural language conversations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/chat')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Start Chatting</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button style={{backgroundColor: 'white'}} className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 ring-2 ring-gray-500 rounded-full hover:text-blue-600 hover:ring-blue-500 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Hero Image/Mockup */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 min-h-96">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-center text-gray-500">
                    INGRES AI ChatBOT Interface
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 max-w-xs">
                    <p className="text-blue-800">What's the groundwater status in Kerala?</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 max-w-md ml-auto">
                    <p className="text-gray-800">Kerala has 14 districts with varying groundwater conditions. Currently, 8 districts are in the 'Safe' category, 4 are 'Semi-Critical', and 2 require immediate attention...</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 max-w-xs">
                    <p className="text-blue-800">Show me the trend for the last 5 years</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 max-w-md ml-auto flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <p className="text-gray-800">Here's the groundwater trend analysis...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From researchers to policymakers, our AI-powered platform serves diverse users 
              with comprehensive groundwater data and insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About INGRES AI ChatBOT
              </h2>
              <div className="space-y-6 text-gray-600">
                <p className="text-lg leading-relaxed">
                  The Assessment of Dynamic Ground Water Resources of India is conducted annually by the 
                  Central Ground Water Board (CGWB) and State/UT Ground Water Departments, under the 
                  coordination of the Central Level Expert Group (CLEG).
                </p>
                <p className="text-lg leading-relaxed">
                  Our AI-powered ChatBOT transforms how users interact with the vast INGRES database, 
                  making groundwater information accessible through natural language conversations.
                </p>
                <div className="flex items-start space-x-4">
                  <Users className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Who Benefits?</h4>
                    <p>Researchers, policymakers, planners, and the general public seeking groundwater insights.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <Database className="w-10 h-10 text-blue-600 mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">GIS-Based System</h4>
                <p className="text-gray-600 text-sm">Built on advanced INGRES platform</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <Globe className="w-10 h-10 text-cyan-600 mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Pan-India Coverage</h4>
                <p className="text-gray-600 text-sm">All states and union territories</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <BarChart3 className="w-10 h-10 text-blue-600 mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Scientific Analysis</h4>
                <p className="text-gray-600 text-sm">Evidence-based categorization</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <MessageSquare className="w-10 h-10 text-cyan-600 mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
                <p className="text-gray-600 text-sm">Intelligent query processing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Explore India's Groundwater Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Start conversations with our AI assistant and discover insights about groundwater 
            resources across India's assessment units.
          </p>
          <button 
            onClick={() => navigate('/chat')}
            style={{backgroundColor: 'white'}} 
            className="text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto">
            <MessageSquare className="w-5 h-5" />
            <span>Launch ChatBOT</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">INGRES AI</span>
              </div>
              <p className="text-gray-400">
                Making groundwater data accessible through intelligent conversations.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Organization</h4>
              <div className="space-y-2 text-gray-400">
                <p>Central Ground Water Board</p>
                <p>Ministry of Jal Shakti</p>
                <p>Government of India</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">INGRES Portal</a>
                <a href="#" className="block hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block hover:text-white transition-colors">API Guide</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>ingres@cgwb.gov.in</p>
                <p>Support Portal</p>
                <p>FAQs</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Central Ground Water Board. All rights reserved.</p>
            <p className="mt-2">Developed in collaboration with IIT Hyderabad</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;