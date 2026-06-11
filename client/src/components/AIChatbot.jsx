import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AIChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello${user ? ` ${user.name}` : ''}! 👋 I'm AgriBot, your farming assistant. I can help you with:
\n🌱 Crop advice and farming tips
\n💰 Market prices and selling strategies  
\n🌤️ Weather-based farming guidance
\n🛒 Using AgriShop features
\nHow can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are AgriBot, a helpful AI assistant for AgriShop - an Indian agricultural marketplace that connects farmers directly with buyers, cutting out middlemen.

You help with:
1. Farming advice - crop selection, pest control, irrigation, soil health
2. Market insights - pricing strategies, best time to sell, demand trends
3. AgriShop features - how to list products, manage orders, use the platform
4. Weather-based farming guidance
5. Government schemes for farmers in India
6. General agricultural support

The user is ${user ? `${user.name}, a ${user.role}` : 'a visitor'} on AgriShop.

Keep responses concise, practical, and helpful. Use simple language as many farmers may not be tech-savvy. Include emojis to make responses friendly. For Indian context, use ₹ for prices and refer to Indian states/crops.`,
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = data.content[0]?.text || 'Sorry, I could not process that. Please try again.';

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantMessage
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I am having trouble connecting. Please try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    '🌱 Best crops for this season?',
    '💰 How to get better prices?',
    '🐛 How to control pests naturally?',
    '📱 How to list my products?'
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-green-700 transition flex items-center justify-center text-2xl z-40"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-40 flex flex-col overflow-hidden"
          style={{ height: '500px' }}>

          {/* Header */}
          <div className="bg-green-700 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h3 className="font-bold">AgriBot</h3>
              <p className="text-xs text-green-200">AI Farming Assistant</p>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="ml-auto hover:bg-green-600 p-1 rounded-lg transition">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-green-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {quickQuestions.map((q, i) => (
                <button key={i}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => {
                      const form = document.getElementById('chatForm');
                      form?.dispatchEvent(new Event('submit', { bubbles: true }));
                    }, 100);
                  }}
                  className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full hover:bg-green-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form id="chatForm" onSubmit={sendMessage}
            className="p-3 border-t flex gap-2">
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about farming..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;