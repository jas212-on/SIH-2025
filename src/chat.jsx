import React, { useState, useRef, useEffect } from 'react';
import { FaPaperclip, FaMicrophone, FaCamera, FaPaperPlane } from 'react-icons/fa';
import './chat.css';

const ChatPage = () => {
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
  const [selectedRole, setSelectedRole] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQuickQueries, setShowQuickQueries] = useState(true);
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
    "Groundwater quality assessment",
    "Groundwater quality in Kerala",
    "Current assessment in Rajasthan"
  ];

  const userRoles = [
    {
      id: 'farmer',
      title: 'Farmer',
      icon: '🌾',
      description: 'Practical recommendations for agricultural water management',
      focus: 'Get actionable insights for crop planning, irrigation guidance, and well management'
    },
    {
      id: 'policymaker',
      title: 'Policymaker',
      icon: '🏛️',
      description: 'Policy insights and governance recommendations',
      focus: 'Access policy-relevant data, regulatory insights, and governance recommendations'
    },
    {
      id: 'researcher',
      title: 'Researcher',
      icon: '🔬',
      description: 'Detailed data and technical analysis',
      focus: 'Comprehensive datasets, methodologies, and detailed technical analysis'
    },
    {
      id: 'general',
      title: 'General User',
      icon: '👤',
      description: 'General information and basic insights',
      focus: 'Easy-to-understand information about groundwater resources'
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
    
    // Hide quick queries if user starts typing their own query
    if (value.trim() && !hasUserTyped) {
      setHasUserTyped(true);
      setShowQuickQueries(false);
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
    setShowQuickQueries(false);
    setHasUserTyped(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: inputMessage,
          role: selectedRole || "general"
        })
      });
      const data = await response.json();
      const botResponse = {
        type: 'bot',
        content: data.final_answer || "Sorry, I couldn't find an answer.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "⚠️ Error: Could not connect to server.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuery = (query) => {
    setInputMessage(query);
    setShowQuickQueries(false);
    setHasUserTyped(true);
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    const selectedRoleData = userRoles.find(r => r.id === roleId);
    if (selectedRoleData) {
      const roleMessage = {
        type: 'bot',
        content: `Great! I've set your role as ${selectedRoleData.title}. ${selectedRoleData.focus}. How can I help you today?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, roleMessage]);
    }
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
      setShowQuickQueries(false);
      setHasUserTyped(true);
    }
  };

  const clearChat = () => {
    setMessages([{
      type: 'bot',
      content: 'Chat cleared. How can I help you with groundwater data today?',
      timestamp: new Date()
    }]);
    setShowQuickQueries(true);
    setHasUserTyped(false);
    setSelectedRole('');
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
              <h3>Select Your Role</h3>
              <div className="role-grid">
                {userRoles.map((role) => (
                  <div 
                    key={role.id} 
                    className={`role-card ${selectedRole === role.id ? 'role-selected' : ''}`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <div className="role-icon">{role.icon}</div>
                    <h4>{role.title}</h4>
                    <p>{role.description}</p>
                  </div>
                ))}
              </div>
              {selectedRole && (
                <div className="selected-role-info">
                  <p className="role-focus">
                    {userRoles.find(r => r.id === selectedRole)?.focus}
                  </p>
                </div>
              )}
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
          {/* Quick Query Buttons - Only show at start */}
          {showQuickQueries && (
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
                  <FaPaperclip size={50} color='black' />
                </button>
                <button className="feature-btn interactive" title="Voice input">
                  <FaMicrophone size={50} color='black' />
                </button>
                <button className="feature-btn interactive" title="Camera">
                  <FaCamera size={50} color='black'/>
                </button>
              </div>
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about groundwater data, assessments, or any INGRES related queries..."
                className="message-input"
              />
              <button 
                className="send-btn interactive"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                <FaPaperPlane size={50} color='black'/>
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

export default ChatPage;