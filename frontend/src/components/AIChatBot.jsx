import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, CornerDownLeft, RefreshCw, MessageSquareQuote, ShieldAlert } from 'lucide-react';
import { sendChatMessage } from '../services/api';

const SUGGESTIONS = [
  "How does BMI & smoking affect health risk?",
  "Explain zero depreciation in auto insurance",
  "What is the 3-year incontestability rule in Life?",
  "How are deterministic risk scores calculated?"
];

export default function AIChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your **InsureAI Copilot**.\n\nAsk me any questions or doubts about underwriting rules, claim guidelines, risk scoring, or health/auto/life policies!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = { role: 'user', content: query.trim() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendChatMessage(
        query.trim(),
        newHistory.slice(-6)
      );
      setMessages([...newHistory, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue reaching the assistant service. Please check backend connectivity.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Side Panel Drawer (Gemini style) */}
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white tracking-wide">InsureAI Copilot</h3>
                <span className="text-[10px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30 font-mono">
                  Gemini & RAG
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Ask any doubts about policies & risk</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMessages([{
                role: 'assistant',
                content: 'Chat refreshed. How can I assist you with insurance risk or guidelines today?'
              }])}
              title="Clear conversation"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/10'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 shadow'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-slate-200 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/90 rounded-2xl px-4 py-3 border border-slate-700/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        {messages.length <= 3 && (
          <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40">
            <p className="text-[11px] text-slate-400 mb-1.5 font-medium flex items-center gap-1">
              <MessageSquareQuote className="w-3 h-3 text-cyan-400" />
              Suggested questions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item)}
                  className="text-[11px] text-slate-300 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-full px-2.5 py-1 text-left transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about insurance policies..."
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className={`p-1.5 rounded-lg transition-all ${
                input.trim() && !loading
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:scale-105'
                  : 'text-slate-600 hover:text-slate-500'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 text-center">
            Grounded in active Health, Automobile & Life Underwriting guidelines
          </p>
        </div>

      </div>
    </div>
  );
}
