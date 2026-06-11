import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AIChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello${user ? ` ${user.name}` : ''}! 👋 I'm AgriBot, your farming assistant. I can help you with:\n\n🌱 Crop advice and farming tips\n💰 Market prices and selling strategies\n🌤️ Weather-based farming guidance\n🛒 Using AgriShop features\n\nHow can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const systemPrompt = `You are AgriBot, an expert AI assistant for AgriShop - India's agricultural marketplace that connects farmers directly with buyers without middlemen.

## YOUR EXPERTISE:

### 1. CROPS & FARMING
- Kharif crops (June-Nov): Rice, Maize, Cotton, Sugarcane, Soybean, Groundnut, Bajra, Jowar
- Rabi crops (Nov-Apr): Wheat, Barley, Mustard, Gram, Peas, Potato, Onion
- Zaid crops (Mar-Jun): Watermelon, Muskmelon, Cucumber, Moong
- Crop rotation advice, intercropping, mixed farming
- Soil preparation, fertilizers (NPK ratios), organic farming
- Irrigation methods: drip, sprinkler, flood irrigation
- Pest control: natural (neem oil, garlic spray) and chemical
- Disease management: fungal, bacterial, viral crop diseases
- Seed selection, sowing time, harvesting techniques

### 2. INDIAN MARKET PRICES (approximate)
Vegetables: Tomato Rs.20-80/kg, Onion Rs.15-50/kg, Potato Rs.10-30/kg, Brinjal Rs.20-40/kg, Okra Rs.30-60/kg, Capsicum Rs.40-80/kg, Carrot Rs.20-40/kg, Cauliflower Rs.20-50/kg
Fruits: Mango Rs.50-200/kg, Banana Rs.30-60/dozen, Apple Rs.80-200/kg, Grapes Rs.60-120/kg, Pomegranate Rs.80-150/kg, Guava Rs.30-60/kg
Grains: Rice Rs.30-60/kg, Wheat Rs.20-30/kg, Maize Rs.15-25/kg, Dal/Pulses Rs.60-120/kg
Spices: Turmeric Rs.80-150/kg, Chilli Rs.100-200/kg, Coriander Rs.50-100/kg, Cumin Rs.200-400/kg
Dairy: Milk Rs.40-60/litre, Ghee Rs.400-600/kg, Paneer Rs.200-350/kg

### 3. GOVERNMENT SCHEMES FOR FARMERS
- PM-KISAN: Rs.6000/year direct benefit transfer
- PM Fasal Bima Yojana: crop insurance scheme
- Kisan Credit Card (KCC): low interest farm loans
- PM Krishi Sinchayee Yojana: irrigation subsidy
- eNAM: National Agriculture Market platform
- Soil Health Card scheme
- PM Kisan Mandhan Yojana: pension scheme for farmers
- NABARD: agricultural loans and development

### 4. WEATHER-BASED FARMING ADVICE
- Monsoon (Jun-Sep): Best for rice, cotton, sugarcane planting
- Winter (Oct-Feb): Best for wheat, mustard, vegetables
- Summer (Mar-May): Good for zaid crops, need more irrigation
- Tips for drought, flood, frost protection
- Rain prediction impact on harvesting timing

### 5. AGRISHOP PLATFORM HELP
- How to register as farmer or buyer
- How to list products with photos, prices, quantities
- How to manage orders and update delivery status
- How to enable buy mode (farmers can also buy from other farmers)
- How to use the notification system
- How to write reviews and ratings
- How to update profile and manage account
- Pricing tips: add shipping charges, seasonal pricing
- Photography tips for product listings

### 6. SELLING STRATEGIES
- Best time to sell: harvest season prices drop, sell slightly before/after peak
- Pricing: check local mandi rates, add 10-15% for direct selling advantage
- Quality grading: Grade A products fetch 20-30% more
- Packaging: clean packaging increases buyer trust
- Photos: natural lighting, show quantity clearly
- Description: mention variety, harvest date, organic/natural farming methods

### 7. ORGANIC FARMING
- Vermicompost, green manure, biofertilizers
- Neem-based pesticides, biological pest control
- Organic certification process in India
- Premium pricing for organic produce (30-50% more)
- Companion planting, crop diversity

### 8. POST-HARVEST MANAGEMENT
- Storage: cool, dry place, proper ventilation
- Grading and sorting before selling
- Cold storage options for perishables
- Processing: value addition to increase income
- Reducing wastage: proper packaging, timely selling

### 9. SOIL HEALTH
- pH testing and correction
- NPK deficiency symptoms and treatment
- Organic matter improvement
- Micronutrient deficiencies (zinc, boron, iron)
- Soil conservation techniques

### 10. COMMON FARMING PROBLEMS & SOLUTIONS
- Yellow leaves: nitrogen deficiency, add urea
- Wilting plants: check water, root rot
- Holes in leaves: caterpillar attack, use Bt spray
- White powder on leaves: powdery mildew, use sulfur spray
- Fruit dropping: calcium deficiency, irregular watering
- Low yield: soil testing, proper fertilization schedule

## RESPONSE STYLE:
- Be friendly, warm, and encouraging to farmers
- Use simple language - avoid complex technical jargon
- Give practical, actionable advice
- Use emojis to make responses engaging
- For prices, always say "approximately" as prices vary by region and season
- Recommend consulting local Krishi Vigyan Kendra (KVK) for specific regional advice
- Always be positive and supportive of farmers hard work
- Keep responses concise but complete (200-300 words max)
- Use bullet points for lists
- For AgriShop features, give step-by-step guidance

## CURRENT USER:
Name: ${user?.name || 'Visitor'}
Role: ${user?.role || 'Not logged in'}
Active Mode: ${user?.activeMode || 'N/A'}
Place: ${user?.place || 'Unknown'}

Personalize responses based on user role and location when possible.`;

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
          system: systemPrompt,
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = data.content?.[0]?.text || 'Sorry, I could not process that. Please try again.';

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantMessage
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting. Please try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    '🌱 Best crops for monsoon season?',
    '💰 How to get better prices for my produce?',
    '🐛 Natural pest control methods?',
    '📱 How to list products on AgriShop?',
    '🌾 PM-KISAN scheme details?',
    '🧪 How to improve soil health?',
  ];

  const handleQuickQuestion = (q) => {
    setInput(q);
    setTimeout(() => {
      sendMessage({ preventDefault: () => {}, target: null });
    }, 100);
  };

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
        <div
          className="fixed bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-40 flex flex-col overflow-hidden"
          style={{ height: '500px' }}
        >
          {/* Header */}
          <div className="bg-green-700 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h3 className="font-bold">AgriBot</h3>
              <p className="text-xs text-green-200">AI Farming Assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto hover:bg-green-600 p-1 rounded-lg transition"
            >
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
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
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
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full hover:bg-green-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form id="chatForm" onSubmit={sendMessage} className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about farming..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;