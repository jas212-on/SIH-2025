import React, { useState, useRef, useEffect } from 'react';
import './chat.css';
import { 
  FaPaperclip, 
  FaMicrophone, 
  FaCamera,
  FaBars,
  FaUser,
  FaRobot,
  FaTrash
} from "react-icons/fa";

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
  const [hasUserTyped, setHasUserTyped] = useState(false);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputMessage(value);
    
    // Hide quick queries when user starts typing
    if (value.trim() && !hasUserTyped) {
      setHasUserTyped(true);
      setQuickQueriesVisible(false);
    }
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
    
    // Hide quick queries after sending message
    setQuickQueriesVisible(false);
    setHasUserTyped(true);

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
    setQuickQueriesVisible(false);
    setHasUserTyped(true);
    
    // Auto-send the quick query
    const userMessage = {
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate API call delay
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        content: `Here's information about: "${query}". This is where I would process your query and provide relevant groundwater data. The actual AI integration will be implemented separately.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
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
      setQuickQueriesVisible(false);
      setHasUserTyped(true);
    }
  };

  const clearChat = () => {
    setMessages([{
      type: 'bot',
      content: 'Chat cleared. How can I help you with groundwater data today?',
      timestamp: new Date()
    }]);
    setQuickQueriesVisible(true);
    setHasUserTyped(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
              <FaBars />
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
              <FaUser />
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
                  <FaTrash /> Clear Chat
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-main">
          {/* Quick Query Buttons - Only show initially */}
          {quickQueriesVisible && !hasUserTyped && (
            <div className="quick-queries-section">
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
          )}

          {/* Messages Container */}
          <div className="messages-container" ref={messagesContainerRef}>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  {message.type === 'user' ? <FaUser /> : <FaRobot />}
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
                <div className="message-avatar"><FaRobot /></div>
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
                  <FaPaperclip />
                </button>
                <button className="feature-btn interactive" title="Voice input">
                  <FaMicrophone />
                </button>
                <button className="feature-btn interactive" title="Camera">
                  <FaCamera />
                </button>
              </div>
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
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