'use client';

import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I can help explain legal and privacy terms you find in documents. Just ask me about any term you'd like to understand better.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (in a real app, this would call your API)
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Predefined responses for common government policy terms
    const responses = {
      'gdpr': "GDPR (General Data Protection Regulation) is a comprehensive data protection law in the EU that governs how personal data is collected, processed, and stored. It gives individuals control over their personal data and requires organizations to implement strong data protection measures.",
      
      'ccpa': "CCPA (California Consumer Privacy Act) is a state law that gives California residents the right to know what personal information is being collected about them, whether it's being sold or disclosed, and to whom. It also gives them the right to say no to the sale of personal information.",
      
      'hipaa': "HIPAA (Health Insurance Portability and Accountability Act) is a federal law that protects the privacy and security of individuals' health information. It sets standards for how healthcare providers, insurers, and other covered entities must handle protected health information.",
      
      'pii': "PII (Personally Identifiable Information) refers to any data that can be used to identify a specific individual. This includes names, addresses, phone numbers, email addresses, social security numbers, and other unique identifiers.",
      
      'data processing': "Data processing refers to any operation performed on personal data, such as collection, recording, organization, structuring, storage, adaptation, retrieval, consultation, use, disclosure, transmission, dissemination, or otherwise making available personal data.",
      
      'consent': "Consent in privacy law refers to a clear, affirmative action by an individual that indicates their agreement to the processing of their personal data. It must be freely given, specific, informed, and unambiguous.",
      
      'data breach': "A data breach occurs when there is unauthorized access to, or disclosure of, personal data. Organizations are typically required to notify affected individuals and relevant authorities within specific timeframes when a breach occurs.",
      
      'data retention': "Data retention refers to the policies and practices that determine how long personal data should be kept. Organizations must have legitimate reasons for retaining data and should delete it when it's no longer needed.",
      
      'third party': "A third party in privacy contexts refers to any entity other than the data controller and the data subject. This includes vendors, service providers, partners, or any other organization that receives or processes personal data.",
      
      'data controller': "A data controller is the entity that determines the purposes and means of processing personal data. They are responsible for ensuring compliance with privacy laws and protecting individuals' rights.",
      
      'data processor': "A data processor is an entity that processes personal data on behalf of a data controller. They must follow the controller's instructions and implement appropriate security measures.",
      
      'right to be forgotten': "The right to be forgotten (or right to erasure) allows individuals to request that their personal data be deleted when it's no longer necessary, when consent is withdrawn, or when the data has been unlawfully processed.",
      
      'data portability': "Data portability is the right for individuals to receive their personal data in a structured, commonly used format and to transmit that data to another controller without hindrance.",
      
      'privacy by design': "Privacy by design is an approach that embeds privacy considerations into the design and operation of systems, processes, and business practices from the outset, rather than as an afterthought.",
      
      'data minimization': "Data minimization is the principle that organizations should only collect and process the minimum amount of personal data necessary to achieve their stated purpose."
    };

    // Check for exact matches first
    for (const [term, response] of Object.entries(responses)) {
      if (input.includes(term)) {
        return response;
      }
    }

    // If no specific match, provide a general helpful response
    return "I'd be happy to explain that term! However, I'm currently designed to explain common privacy and data protection terms. Could you try asking about terms like 'GDPR', 'CCPA', 'HIPAA', 'PII', 'data processing', 'consent', 'data breach', or 'privacy by design'? I can provide detailed explanations for these and other privacy-related concepts.";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-80 h-[450px] flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm">Lexify Assistant</h3>
                <p className="text-xs text-gray-400">Ask about legal terms</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.type === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-emerald-200' : 'text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about a term..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


