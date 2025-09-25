// import { useState, useRef, useEffect } from 'react';
// import { FaPaperclip, FaPaperPlane, FaTrashAlt, FaRobot, FaChevronDown } from 'react-icons/fa';
// import { IoReorderThree, IoPerson } from 'react-icons/io5';
// import { GiWaterSplash } from "react-icons/gi";
// import './chat.css';

// const ChatPage = () => {
//   const [messages, setMessages] = useState([
//     {
//       type: 'bot',
//       content: 'Hello! I\'m the INGRES AI Assistant. I can help you access groundwater resource data, historical assessments, and provide insights about India\'s dynamic groundwater resources. How can I assist you today?',
//       timestamp: new Date()
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState('en');
//   const [selectedRole, setSelectedRole] = useState('');
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [showQuickQueries, setShowQuickQueries] = useState(true);
//   const [hasUserTyped, setHasUserTyped] = useState(false);
//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const messagesContainerRef = useRef(null);

//   const languages = [
//     { code: 'en', name: 'English' },
//     { code: 'hi', name: 'हिंदी' },
//     { code: 'te', name: 'తెలుగు' },
//     { code: 'ta', name: 'தமிழ்' },
//     { code: 'kn', name: 'ಕನ್ನಡ' },
//     { code: 'ml', name: 'മലയാളം' }
//   ];

//   const quickQueries = [
//     "Show groundwater levels in Karnataka",
//     "Critical blocks in Maharashtra",
//     "Historical data for Tamil Nadu",
//     "Recharge estimation methodology",
//     "Over-exploited areas in Punjab",
//     "Groundwater quality assessment",
//     "Groundwater quality in Kerala",
//     "Current assessment in Rajasthan"
//   ];

//   const userRoles = [
//     {
//       id: 'farmer',
//       title: 'Farmer',
//       icon: '🌾',
//       description: 'Practical recommendations for agricultural water management',
//       focus: 'Get actionable insights for crop planning, irrigation guidance, and well management'
//     },
//     {
//       id: 'policymaker',
//       title: 'Policymaker',
//       icon: '🏛️',
//       description: 'Policy insights and governance recommendations',
//       focus: 'Access policy-relevant data, regulatory insights, and governance recommendations'
//     },
//     {
//       id: 'researcher',
//       title: 'Researcher',
//       icon: '🔬',
//       description: 'Detailed data and technical analysis',
//       focus: 'Comprehensive datasets, methodologies, and detailed technical analysis'
//     },
//     {
//       id: 'general',
//       title: 'General User',
//       icon: '👤',
//       description: 'General information and basic insights',
//       focus: 'Easy-to-understand information about groundwater resources'
//     }
//   ];

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setInputMessage(value);
    
//     // Hide quick queries if user starts typing their own query
//     if (value.trim() && !hasUserTyped) {
//       setHasUserTyped(true);
//       setShowQuickQueries(false);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMessage = {
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsTyping(true);
//     setShowQuickQueries(false);
//     setHasUserTyped(true);

//     try {
//       const response = await fetch("http://localhost:8000/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           query: inputMessage,
//           role: selectedRole || "general"
//         })
//       });
//       const data = await response.json();
//       const botResponse = {
//         type: 'bot',
//         content: data.final_answer || "Sorry, I couldn't find an answer.",
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, botResponse]);
//     } catch (error) {
//       setMessages(prev => [...prev, {
//         type: 'bot',
//         content: "⚠️ Error: Could not connect to server.",
//         timestamp: new Date()
//       }]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleQuickQuery = (query) => {
//     setInputMessage(query);
//     setShowQuickQueries(false);
//     setHasUserTyped(true);
//   };

//   const handleRoleSelect = (roleId) => {
//     setSelectedRole(roleId);
//     const selectedRoleData = userRoles.find(r => r.id === roleId);
//     if (selectedRoleData) {
//       const roleMessage = {
//         type: 'bot',
//         content: `Great! I've set your role as ${selectedRoleData.title}. ${selectedRoleData.focus}. How can I help you today?`,
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, roleMessage]);
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const fileMessage = {
//         type: 'user',
//         content: <div><FaPaperclip  size={50} color='black' /> {`Uploaded file: ${file.name}`}</div>,
//         timestamp: new Date(),
//         isFile: true
//       };
//       setMessages(prev => [...prev, fileMessage]);
//       setShowQuickQueries(false);
//       setHasUserTyped(true);
//     }
//   };

//   const clearChat = () => {
//     setMessages([{
//       type: 'bot',
//       content: 'Chat cleared. How can I help you with groundwater data today?',
//       timestamp: new Date()
//     }]);
//     setShowQuickQueries(true);
//     setHasUserTyped(false);
//     setSelectedRole('');
//   };

//   return (
//     <div className="chatbot-container">
//       {/* Header */}
//       <header className="chat-header">
//         <div className="header-content">
//           <div className="header-left">
//             <button 
//               className="menu-btn interactive"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//               <IoReorderThree  size={25} color='black' />
//             </button>
//             <div className="logo-section">
//               <div className="logo-icon"><GiWaterSplash style={{ color: "#63daf8ff", fontSize: "50px" }} /></div>
//               <div className="logo-text">
//                 <h1>JALMITRA</h1>
//                 <p className="tagline">Intelligent Groundwater Resource Assistant</p>
//               </div>
//             </div>
//           </div>
//           <div className="header-right">
//             <div className="language-selector-container">
//               <select 
//                 className="language-selector"
//                 value={selectedLanguage}
//                 onChange={(e) => setSelectedLanguage(e.target.value)}
//               >
//                 {languages.map(lang => (
//                   <option key={lang.code} value={lang.code}>{lang.name}</option>
//                 ))}
//               </select>
//               <FaChevronDown className="language-selector-arrow" size={12} />
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="main-layout">
//         {/* Sidebar */}
//         <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
//           <div className="sidebar-content">
//             <div className="sidebar-section">
//               <h3>Select Your Role</h3>
//               <div className="role-grid">
//                 {userRoles.map((role) => (
//                   <div 
//                     key={role.id} 
//                     className={`role-card ${selectedRole === role.id ? 'role-selected' : ''}`}
//                     onClick={() => handleRoleSelect(role.id)}
//                   >
//                     <div className="role-icon">{role.icon}</div>
//                     <h4>{role.title}</h4>
//                     <p>{role.description}</p>
//                   </div>
//                 ))}
//               </div>
//               {selectedRole && (
//                 <div className="selected-role-info">
//                   <p className="role-focus">
//                     {userRoles.find(r => r.id === selectedRole)?.focus}
//                   </p>
//                 </div>
//               )}
//             </div>
            
//             <div className="sidebar-section">
//               <h3>Chat Actions</h3>
//               <div className="action-buttons">
//                 <button className="action-btn" onClick={clearChat}>
//                   <FaTrashAlt size={20} color='black' /> Clear Chat
//                 </button>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main Chat Area */}
//         <main className="chat-main">
//           {/* Quick Query Buttons - Only show at start */}
//           {showQuickQueries && (
//             <div className="quick-queries-section">
//               <h3>Quick Queries</h3>
//               <div className="quick-queries-grid">
//                 {quickQueries.map((query, index) => (
//                   <button 
//                     key={index}
//                     className="quick-query-btn"
//                     onClick={() => handleQuickQuery(query)}
//                   >
//                     {query}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Messages Container */}
//           <div className="messages-container" ref={messagesContainerRef}>
//             {messages.map((message, index) => (
//               <div 
//                 key={index} 
//                 className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
//               >
//                 <div className="message-avatar">
//                   {message.type === 'user' ? <IoPerson size={25} color='black' /> : <FaRobot size={25} color='black' />}
//                 </div>
//                 <div className="message-content">
//                   <div className="message-bubble">
//                     {message.isFile ? (
//                       <div className="file-message">
//                         {message.content}
//                       </div>
//                     ) : (
//                       <p>{message.content}</p>
//                     )}
//                   </div>
//                   <div className="message-timestamp">
//                     {message.timestamp.toLocaleTimeString()}
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             {isTyping && (
//               <div className="message bot-message">
//                 <div className="message-avatar"><FaRobot size={25} color='black' /></div>
//                 <div className="message-content">
//                   <div className="message-bubble typing-indicator">
//                     <div className="typing-dots">
//                       <span></span>
//                       <span></span>
//                       <span></span>
//                     </div>
//                     <span>AI is thinking...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="input-area">
//             <div className="input-container">
//               <div className="input-features">
//                 <button 
//                   className="feature-btn interactive"
//                   onClick={() => fileInputRef.current?.click()}
//                   title="Upload file"
//                 >
//                   <FaPaperclip size={50} color='black' />
//                 </button>
//               </div>
//               <input
//                 type="text"
//                 value={inputMessage}
//                 onChange={handleInputChange}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                 placeholder="Ask me about groundwater data, assessments, or any INGRES related queries..."
//                 className="message-input"
//               />
//               <button 
//                 className="send-btn interactive"
//                 onClick={handleSendMessage}
//                 disabled={!inputMessage.trim()}
//               >
//                 <FaPaperPlane size={50} color='black'/>
//               </button>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* Hidden file input */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileUpload}
//         style={{ display: 'none' }}
//         accept=".csv,.xlsx,.pdf,.txt"
//       />
//     </div>
//   );
// };

// export default ChatPage;




// import { useState, useRef, useEffect } from 'react';
// import { FaPaperclip, FaPaperPlane, FaTrashAlt, FaRobot, FaChevronDown, FaChartBar } from 'react-icons/fa';
// import { IoReorderThree, IoPerson } from 'react-icons/io5';
// import { GiWaterSplash } from "react-icons/gi";
// import DataVisualization from './DataVisualization';
// import './chat.css';

// const ChatPage = () => {
//   const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'visualization'
//   const [messages, setMessages] = useState([
//     {
//       type: 'bot',
//       content: 'Hello! I\'m JALMITRA, your AI Assistant for groundwater resources. I can help you access groundwater data, historical assessments, and provide insights about India\'s dynamic groundwater resources. You can also explore our interactive data visualization feature. How can I assist you today?',
//       timestamp: new Date()
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState('en');
//   const [selectedRole, setSelectedRole] = useState('');
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [showQuickQueries, setShowQuickQueries] = useState(true);
//   const [hasUserTyped, setHasUserTyped] = useState(false);
//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const messagesContainerRef = useRef(null);

//   const languages = [
//     { code: 'en', name: 'English' },
//     { code: 'hi', name: 'हिंदी' },
//     { code: 'te', name: 'తెలుగు' },
//     { code: 'ta', name: 'தமிழ்' },
//     { code: 'kn', name: 'ಕನ್ನಡ' },
//     { code: 'ml', name: 'മലയാളം' }
//   ];

//   const quickQueries = [
//     "Show groundwater levels in Karnataka",
//     "Critical blocks in Maharashtra", 
//     "Historical data for Tamil Nadu",
//     "Recharge estimation methodology",
//     "Over-exploited areas in Punjab",
//     "Groundwater quality assessment",
//     "Groundwater quality in Kerala",
//     "Current assessment in Rajasthan"
//   ];

//   const userRoles = [
//     {
//       id: 'farmer',
//       title: 'Farmer',
//       icon: '🌾',
//       description: 'Practical recommendations for agricultural water management',
//       focus: 'Get actionable insights for crop planning, irrigation guidance, and well management'
//     },
//     {
//       id: 'policymaker',
//       title: 'Policymaker',
//       icon: '🏛️',
//       description: 'Policy insights and governance recommendations',
//       focus: 'Access policy-relevant data, regulatory insights, and governance recommendations'
//     },
//     {
//       id: 'researcher',
//       title: 'Researcher',
//       icon: '🔬',
//       description: 'Detailed data and technical analysis',
//       focus: 'Comprehensive datasets, methodologies, and detailed technical analysis'
//     },
//     {
//       id: 'general',
//       title: 'General User',
//       icon: '👤',
//       description: 'General information and basic insights',
//       focus: 'Easy-to-understand information about groundwater resources'
//     }
//   ];

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setInputMessage(value);
    
//     if (value.trim() && !hasUserTyped) {
//       setHasUserTyped(true);
//       setShowQuickQueries(false);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMessage = {
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsTyping(true);
//     setShowQuickQueries(false);
//     setHasUserTyped(true);

//     try {
//       const response = await fetch("http://localhost:8000/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           query: inputMessage,
//           role: selectedRole || "general"
//         })
//       });
//       const data = await response.json();
//       const botResponse = {
//         type: 'bot',
//         content: data.final_answer || "Sorry, I couldn't find an answer.",
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, botResponse]);
//     } catch (error) {
//       setMessages(prev => [...prev, {
//         type: 'bot',
//         content: "⚠️ Error: Could not connect to server.",
//         timestamp: new Date()
//       }]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleQuickQuery = (query) => {
//     setInputMessage(query);
//     setShowQuickQueries(false);
//     setHasUserTyped(true);
//   };

//   const handleRoleSelect = (roleId) => {
//     setSelectedRole(roleId);
//     const selectedRoleData = userRoles.find(r => r.id === roleId);
//     if (selectedRoleData) {
//       const roleMessage = {
//         type: 'bot',
//         content: `Great! I've set your role as ${selectedRoleData.title}. ${selectedRoleData.focus}. How can I help you today?`,
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, roleMessage]);
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const fileMessage = {
//         type: 'user',
//         content: <div><FaPaperclip size={16} className="inline mr-2" /> {`Uploaded file: ${file.name}`}</div>,
//         timestamp: new Date(),
//         isFile: true
//       };
//       setMessages(prev => [...prev, fileMessage]);
//       setShowQuickQueries(false);
//       setHasUserTyped(true);
//     }
//   };

//   const clearChat = () => {
//     setMessages([{
//       type: 'bot',
//       content: 'Chat cleared. How can I help you with groundwater data today?',
//       timestamp: new Date()
//     }]);
//     setShowQuickQueries(true);
//     setHasUserTyped(false);
//     setSelectedRole('');
//   };

//   const navigateToVisualization = () => {
//     setCurrentView('visualization');
//   };

//   const navigateToChat = () => {
//     setCurrentView('chat');
//   };

//   // Render data visualization if selected
//   if (currentView === 'visualization') {
//     return <DataVisualization onBack={navigateToChat} />;
//   }

//   return (
//     <div className="chatbot-container">
//       {/* Header */}
//       <header className="chat-header">
//         <div className="header-content">
//           <div className="header-left">
//             <button 
//               className="menu-btn interactive"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//               <IoReorderThree size={25} />
//             </button>
//             <div className="logo-section">
//               <div className="logo-icon">
//                 <GiWaterSplash style={{ color: "#63daf8ff", fontSize: "50px" }} />
//               </div>
//               <div className="logo-text">
//                 <h1>JALMITRA</h1>
//                 <p className="tagline">Intelligent Groundwater Resource Assistant</p>
//               </div>
//             </div>
//           </div>
//           <div className="header-right">
//             {/* Data Visualization Navigation Button */}
//             <button
//               onClick={navigateToVisualization}
//               className="visualization-nav-btn flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
//               title="Interactive Data Visualization"
//             >
//               <FaChartBar size={16} />
//               <span className="font-medium">Visualize Data</span>
//             </button>
            
//             <div className="language-selector-container">
//               <select 
//                 className="language-selector"
//                 value={selectedLanguage}
//                 onChange={(e) => setSelectedLanguage(e.target.value)}
//               >
//                 {languages.map(lang => (
//                   <option key={lang.code} value={lang.code}>{lang.name}</option>
//                 ))}
//               </select>
//               <FaChevronDown className="language-selector-arrow" size={12} />
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="main-layout">
//         {/* Sidebar */}
//         <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
//           <div className="sidebar-content">
//             <div className="sidebar-section">
//               <h3>Select Your Role</h3>
//               <div className="role-grid">
//                 {userRoles.map((role) => (
//                   <div 
//                     key={role.id} 
//                     className={`role-card ${selectedRole === role.id ? 'role-selected' : ''}`}
//                     onClick={() => handleRoleSelect(role.id)}
//                   >
//                     <div className="role-icon">{role.icon}</div>
//                     <h4>{role.title}</h4>
//                     <p>{role.description}</p>
//                   </div>
//                 ))}
//               </div>
//               {selectedRole && (
//                 <div className="selected-role-info">
//                   <p className="role-focus">
//                     {userRoles.find(r => r.id === selectedRole)?.focus}
//                   </p>
//                 </div>
//               )}
//             </div>
            
//             <div className="sidebar-section">
//               <h3>Features</h3>
//               <div className="action-buttons">
//                 <button 
//                   className="action-btn visualization-feature-btn"
//                   onClick={navigateToVisualization}
//                 >
//                   <FaChartBar size={16} /> 
//                   Data Visualization
//                 </button>
//                 <button className="action-btn" onClick={clearChat}>
//                   <FaTrashAlt size={16} /> 
//                   Clear Chat
//                 </button>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main Chat Area */}
//         <main className="chat-main">
//           {/* Quick Query Buttons - Only show at start */}
//           {showQuickQueries && (
//             <div className="quick-queries-section">
//               <h3>Quick Queries</h3>
//               <div className="quick-queries-grid">
//                 {quickQueries.map((query, index) => (
//                   <button 
//                     key={index}
//                     className="quick-query-btn"
//                     onClick={() => handleQuickQuery(query)}
//                   >
//                     {query}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Messages Container */}
//           <div className="messages-container" ref={messagesContainerRef}>
//             {messages.map((message, index) => (
//               <div 
//                 key={index} 
//                 className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
//               >
//                 <div className="message-avatar">
//                   {message.type === 'user' ? <IoPerson size={20} /> : <FaRobot size={20} />}
//                 </div>
//                 <div className="message-content">
//                   <div className="message-bubble">
//                     {message.isFile ? (
//                       <div className="file-message">
//                         {message.content}
//                       </div>
//                     ) : (
//                       <p>{message.content}</p>
//                     )}
//                   </div>
//                   <div className="message-timestamp">
//                     {message.timestamp.toLocaleTimeString()}
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             {isTyping && (
//               <div className="message bot-message">
//                 <div className="message-avatar"><FaRobot size={20} /></div>
//                 <div className="message-content">
//                   <div className="message-bubble typing-indicator">
//                     <div className="typing-dots">
//                       <span></span>
//                       <span></span>
//                       <span></span>
//                     </div>
//                     <span>AI is thinking...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="input-area">
//             <div className="input-container">
//               <div className="input-features">
//                 <button 
//                   className="feature-btn"
//                   onClick={() => fileInputRef.current?.click()}
//                   title="Upload file"
//                 >
//                   <FaPaperclip size={40} />
//                 </button>
//               </div>
//               <input
//                 type="text"
//                 value={inputMessage}
//                 onChange={handleInputChange}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                 placeholder="Ask me about groundwater data, assessments, or any JALMITRA related queries..."
//                 className="message-input"
//               />
//               <button 
//                 className="send-btn"
//                 onClick={handleSendMessage}
//                 disabled={!inputMessage.trim()}
//               >
//                 <FaPaperPlane size={20} />
//               </button>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* Hidden file input */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileUpload}
//         style={{ display: 'none' }}
//         accept=".csv,.xlsx,.pdf,.txt"
//       />
//     </div>
//   );
// };

// export default ChatPage;

























import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPaperclip, FaPaperPlane, FaTrashAlt, FaRobot, FaChevronDown, FaChartBar } from 'react-icons/fa';
import { IoReorderThree, IoPerson } from 'react-icons/io5';
import { GiWaterSplash } from "react-icons/gi";
import DataVisualization from './DataVisualization';
import './chat.css';

const ChatPage = () => {
  const { t, i18n } = useTranslation();
  
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'visualization'
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: t('greeting'),
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRole, setSelectedRole] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  // Get localized quick queries
  const quickQueries = [
    t('quickQueries.q1'),
    t('quickQueries.q2'),
    t('quickQueries.q3'),
    t('quickQueries.q4'),
    t('quickQueries.q5'),
    t('quickQueries.q6'),
    t('quickQueries.q7'),
    t('quickQueries.q8')
  ];

  // Get localized user roles
  const userRoles = [
    {
      id: 'farmer',
      title: t('roles.farmer.title'),
      icon: '🌾',
      description: t('roles.farmer.description'),
      focus: t('roles.farmer.focus')
    },
    {
      id: 'policymaker',
      title: t('roles.policymaker.title'),
      icon: '🏛️',
      description: t('roles.policymaker.description'),
      focus: t('roles.policymaker.focus')
    },
    {
      id: 'researcher',
      title: t('roles.researcher.title'),
      icon: '🔬',
      description: t('roles.researcher.description'),
      focus: t('roles.researcher.focus')
    },
    {
      id: 'general',
      title: t('roles.general.title'),
      icon: '👤',
      description: t('roles.general.description'),
      focus: t('roles.general.focus')
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle language change
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
    
    // Update the initial greeting message when language changes
    setMessages(prev => {
      const updatedMessages = [...prev];
      if (updatedMessages.length > 0 && updatedMessages[0].type === 'bot' && !hasUserTyped) {
        updatedMessages[0] = {
          ...updatedMessages[0],
          content: t('greeting')
        };
      }
      return updatedMessages;
    });
  }, [selectedLanguage, i18n, hasUserTyped]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputMessage(value);
    
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
          role: selectedRole || "general",
          language: selectedLanguage
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
        content: <div><FaPaperclip size={16} className="inline mr-2" /> {`Uploaded file: ${file.name}`}</div>,
        timestamp: new Date(),
        isFile: true
      };
      setMessages(prev => [...prev, fileMessage]);
      setShowQuickQueries(false);
      setHasUserTyped(true);
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
  };

  const clearChat = () => {
    setMessages([{
      type: 'bot',
      content: t('chatCleared'),
      timestamp: new Date()
    }]);
    setShowQuickQueries(true);
    setHasUserTyped(false);
    setSelectedRole('');
  };

  const navigateToVisualization = () => {
    setCurrentView('visualization');
  };

  const navigateToChat = () => {
    setCurrentView('chat');
  };

  // Render data visualization if selected
  if (currentView === 'visualization') {
    return <DataVisualization onBack={navigateToChat} />;
  }

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
              <IoReorderThree size={25} />
            </button>
            <div className="logo-section">
              <div className="logo-icon">
                <GiWaterSplash style={{ color: "#63daf8ff", fontSize: "50px" }} />
              </div>
              <div className="logo-text">
                <h1>JALMITRA</h1>
                <p className="tagline">Intelligent Groundwater Resource Assistant</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            {/* Data Visualization Navigation Button */}
            <button
              onClick={navigateToVisualization}
              className="visualization-nav-btn flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              title="Interactive Data Visualization"
            >
              <FaChartBar size={16} />
              <span className="font-medium">Visualize Data</span>
            </button>
            
            <div className="language-selector-container">
              <select 
                className="language-selector"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              <FaChevronDown className="language-selector-arrow" size={12} />
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
              <h3>Features</h3>
              <div className="action-buttons">
                <button 
                  className="action-btn visualization-feature-btn"
                  onClick={navigateToVisualization}
                >
                  <FaChartBar size={16} /> 
                  Data Visualization
                </button>
                <button className="action-btn" onClick={clearChat}>
                  <FaTrashAlt size={16} /> 
                  Clear Chat
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
                  {message.type === 'user' ? <IoPerson size={20} /> : <FaRobot size={20} />}
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
                <div className="message-avatar"><FaRobot size={20} /></div>
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
                  className="feature-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload file"
                >
                  <FaPaperclip size={40} />
                </button>
              </div>
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about groundwater data, assessments, or any JALMITRA related queries..."
                className="message-input"
              />
              <button 
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                <FaPaperPlane size={20} />
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