import React, { useState, useRef, useEffect } from 'react';
import './chat.css';

export const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m the INGRES AI Assistant. I can help you access groundwater resource data, historical assessments, and provide insights about India\'s dynamic groundwater resources. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickQueriesVisible, setQuickQueriesVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' }
  ];

  const quickQueries = [
    "Show groundwater levels in Karnataka",
    "Critical blocks in Maharashtra",
    "Historical data for Tamil Nadu",
    "Recharge estimation methodology",
    "Over-exploited areas in Punjab",
    "Groundwater quality assessment"
  ];

  const categories = [
    {
      title: "Current Assessment",
      icon: "📊",
      description: "Latest groundwater resource data",
      queries: ["Current groundwater levels", "Recent assessments", "Latest categorization"]
    },
    {
      title: "Historical Data",
      icon: "📈",
      description: "Historical trends and analysis",
      queries: ["Historical trends", "Yearly comparisons", "Long-term analysis"]
    },
    {
      title: "State-wise Data",
      icon: "🗺️",
      description: "State and district level information",
      queries: ["State-wise data", "District analysis", "Block categorization"]
    },
    {
      title: "Technical Info",
      icon: "🔬",
      description: "Methodology and technical details",
      queries: ["Assessment methodology", "Technical parameters", "Calculation methods"]
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const currentScrollY = messagesContainerRef.current.scrollTop;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down
          setQuickQueriesVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up
          setQuickQueriesVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      return () => messagesContainer.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate API call delay
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        content: `I understand you're asking about: "${inputMessage}". This is where I would process your query and provide relevant groundwater data. The actual AI integration will be implemented separately.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickQuery = (query) => {
    setInputMessage(query);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileMessage = {
        type: 'user',
        content: `📎 Uploaded file: ${file.name}`,
        timestamp: new Date(),
        isFile: true
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  const clearChat = () => {
    setMessages([{
      type: 'bot',
      content: 'Chat cleared. How can I help you with groundwater data today?',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <header className="chat-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              className="menu-btn interactive"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <div className="logo-section">
              <div className="logo-icon">🌊</div>
              <div className="logo-text">
                <h1>INGRES AI ChatBot</h1>
                <p className="tagline">Intelligent Groundwater Resource Assistant</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <select 
              className="language-selector"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <div className="profile-photo">
              👤
            </div>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="sidebar-content">
            <div className="sidebar-section">
              <h3>Quick Categories</h3>
              <div className="category-grid">
                {categories.map((category, index) => (
                  <div key={index} className="category-card">
                    <div className="category-icon">{category.icon}</div>
                    <h4>{category.title}</h4>
                    <p>{category.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="sidebar-section">
              <h3>Chat Actions</h3>
              <div className="action-buttons">
                <button className="action-btn" onClick={clearChat}>
                  🗑️ Clear Chat
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-main">
          {/* Quick Query Buttons */}
          <div className={`quick-queries-section ${!quickQueriesVisible ? 'hidden' : ''}`}>
            <h3>Quick Queries</h3>
            <div className="quick-queries-grid">
              {quickQueries.map((query, index) => (
                <button 
                  key={index}
                  className="quick-query-btn"
                  onClick={() => handleQuickQuery(query)}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="messages-container" ref={messagesContainerRef}>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  {message.type === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {message.isFile ? (
                      <div className="file-message">
                        {message.content}
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-bubble typing-indicator">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-container">
              <div className="input-features">
                <button 
                  className="feature-btn interactive"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload file"
                >
                  📎
                </button>
                <button className="feature-btn interactive" title="Voice input">
                  🎤
                </button>
                <button className="feature-btn interactive" title="Camera">
                  📷
                </button>
              </div>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about groundwater data, assessments, or any INGRES related queries..."
                className="message-input"
              />
              <button 
                className="send-btn interactive"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                ➤
              </button>
            </div>
            <div className="input-features-info">
              <div className="feature-info">
                <span>Powered by INGRES AI • Multilingual Support • Real-time Data Access</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        accept=".csv,.xlsx,.pdf,.txt"
      />
    </div>
  );
};