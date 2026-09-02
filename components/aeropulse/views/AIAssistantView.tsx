'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '@/lib/services/aeropulseApi';
import { StationData } from '@/lib/types/aeropulse';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RotateCcw,
  Key,
  ShieldCheck,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface AIAssistantViewProps {
  selectedStation: StationData | null;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  category?: string;
  followups?: string[];
  timestamp: string;
  source?: string;
}

function FormattedMessage({ text, isBot }: { text: string; isBot: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className={`font-bold text-xs mt-2 mb-1 ${isBot ? 'text-slate-900 font-black' : 'text-white'}`}>
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className={`font-black text-sm mt-2 mb-1 ${isBot ? 'text-slate-900' : 'text-white'}`}>
              {trimmed.replace(/^##\s+/, '')}
            </h3>
          );
        }

        const parts = line.split(/(\*\*.*?\*\*)/g);
        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className={isBot ? 'font-extrabold text-slate-900' : 'font-extrabold text-sky-200'}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-2 my-0.5">
              <span className={isBot ? 'text-sky-600 font-bold' : 'text-sky-300'}>•</span>
              <div>{renderedLine}</div>
            </div>
          );
        }

        return <p key={idx}>{renderedLine}</p>;
      })}
    </div>
  );
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ selectedStation }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! I am **AeroBot**, your interactive AI Environmental Intelligence Assistant for Bengaluru.\n\nCurrently inspecting **${selectedStation?.station_name || "Silk Board"}** (AQI **${selectedStation?.aqi || 186} - ${selectedStation?.category || "Moderate"}**), driven by **${selectedStation?.primary_pollutant || "PM2.5"}**.\n\nAsk me anything about air quality, outdoor jogging safety, commute exposure, or indoor air solutions!`,
      category: "Welcome",
      followups: [
        "Can I go for an outdoor run today?",
        "Why is AQI high at Silk Board?",
        "Which Bengaluru area has the cleanest air?",
        "What are the best indoor air purifying plants?"
      ],
      timestamp: 'Just now',
      source: 'AeroBot Intelligence Engine'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: 'Just now'
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!queryText) setInput('');
    setIsTyping(true);

    // Format chat history for multi-turn conversational context
    const historyPayload = updatedMessages
      .filter(m => m.id !== 'welcome')
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

    try {
      const res = await sendChatMessage(
        text,
        selectedStation?.station_name || "Bengaluru Central",
        selectedStation?.aqi || 186,
        historyPayload,
        customKey.trim() || undefined
      );

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.response,
        category: "Response",
        timestamp: 'Just now',
        source: res.source || "AeroBot AI Engine"
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat fetch error:", err);
      const errorMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "I experienced an error connecting to the AI backend. Please check network connectivity or API key configuration.",
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: `Conversation reset. Ready for your environmental queries at **${selectedStation?.station_name || "Bengaluru"}**.`,
        timestamp: 'Just now',
        source: 'AeroBot Intelligence Engine'
      }
    ]);
  };

  const handleSaveKey = () => {
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowConfigModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with API Settings Button */}
      <div className="classy-card rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              AEROBOT REAL AI ASSISTANT
            </h1>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Interactive AI Online
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Powered by multi-turn neural LLM reasoning grounded in CPCB/KSPCB telemetry & Bengaluru urban geography.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition shadow-xs"
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>{customKey ? 'Custom Key Active' : 'API Key Config'}</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="classy-card rounded-3xl p-6 flex flex-col h-[580px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-xs leading-relaxed ${
                    isBot
                      ? 'bg-slate-50 border border-slate-200 text-slate-800 shadow-xs'
                      : 'bg-slate-900 text-white shadow-md'
                  }`}
                >
                  <FormattedMessage text={msg.text} isBot={isBot} />

                  {/* Followup suggestions for bot message */}
                  {msg.followups && (
                    <div className="pt-2.5 flex flex-wrap gap-1.5 border-t border-slate-200/60 mt-2">
                      {msg.followups.map((f, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(f)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-700 text-[11px] font-bold transition shadow-2xs"
                        >
                          💡 {f}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.source && (
                    <div className="text-[10px] text-slate-400 font-mono pt-1 flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-sky-500" />
                      <span>{msg.source}</span>
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-1 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs py-2">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">AeroBot is reasoning...</span>
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-4 border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask AeroBot interactive questions about ${selectedStation?.station_name || "Bengaluru"}...`}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-semibold shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-5 py-3 text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>

      {/* AI Key & Provider Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-black text-slate-900">AI Chatbot API Key Configuration</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-sm"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Free Interactive LLM Active</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  AeroBot automatically uses our free online neural LLM engine if no custom API key is supplied.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-extrabold text-slate-800 block">
                  Custom Gemini / OpenAI API Key (Optional Override):
                </label>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="Paste your Gemini or OpenAI API Key here..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  Keys are stored safely in memory during your active browser session.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleSaveKey}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  {keySaved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Key Applied!</span>
                    </>
                  ) : (
                    <span>Save Key & Close</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

