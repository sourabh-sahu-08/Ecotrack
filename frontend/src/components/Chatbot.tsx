import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Globe2 } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Welcome to the Official EcoTrack Assistant for PARIVESH 3.0. I am here to guide you through environmental clearances, EIA regulations, and compliance procedures. How may I assist you today? (इकोट्रैक आधिकारिक सहायक में आपका स्वागत है। मैं आज आपकी कैसे मदद कर सकता हूँ?)' }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'English'|'Hindi'>('English');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "What is the EIA process?",
    "Check required clearances",
    "CRZ Guidelines"
  ];

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, language })
      });
      
      setIsLoading(false);
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No readable stream");

      setMessages(prev => [...prev, { role: 'ai', text: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text += chunk;
          return newMsgs;
        });
      }
    } catch (error) {
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error connecting to the server.' }]);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-medium text-zinc-100 flex items-center gap-1.5">
                  EcoTrack Official AI
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">PARIVESH 3.0</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setLanguage(l => l === 'English' ? 'Hindi' : 'English')}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-zinc-800 rounded-md text-zinc-300 hover:text-white"
                >
                  <Globe2 size={12} />
                  {language === 'English' ? 'EN' : 'HI'}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-sm' 
                      : 'bg-zinc-800 text-zinc-200 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 text-zinc-400 p-3 rounded-2xl rounded-tl-sm text-sm flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                  </div>
                </div>
              )}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {quickPrompts.map(qp => (
                    <button 
                      key={qp} 
                      onClick={() => handleQuickPrompt(qp)}
                      className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors"
                    >
                      {qp}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="px-4 py-2 bg-zinc-950/80 text-[10px] text-zinc-500 text-center border-t border-zinc-800">
              This is an AI assistant. Information provided is for guidance only and does not substitute official legal or regulatory rulings by the MoEFCC.
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'English' ? "Type your message..." : "अपना संदेश टाइप करें..."}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
