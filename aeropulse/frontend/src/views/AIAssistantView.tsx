import React, { useState } from 'react';
import { sendChatMessage } from '../services/api';
import { StationData } from '../types';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RotateCcw
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
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ selectedStation }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! I am **AeroBot**, your AI Environmental Assistant for the Bengaluru Urban Region.\n\nCurrently, ambient air quality at **${selectedStation?.station_name || "Silk Board"}** is **${selectedStation?.category || "Moderate"} (AQI ${selectedStation?.aqi || 186})**, driven primarily by **${selectedStation?.primary_pollutant || "PM2.5"}**.\n\nHow can I help you manage your environmental exposure today?`,
      category: "Welcome",
      followups: [
        "Can I go for an outdoor run today?",
        "Why is Bengaluru AQI elevated today?",
        "Which Bengaluru locality has cleaner air?",
        "What will the AQI forecast be tomorrow?"
      ],
      timestamp: 'Just now'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    try {
      const res = await sendChatMessage(
        text,
        selectedStation?.station_name,
        selectedStation?.aqi
      );

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.response,
        category: res.category,
        followups: res.suggested_followups,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: "I'm having trouble fetching live Bengaluru telemetry right now. Please try again shortly.",
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title Header */}
      <div className="classy-card rounded-3xl p-6 flex items-center justify-between border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-sky-500 p-0.5 shadow-md shadow-purple-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-600 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">AeroBot Environmental Assistant</h2>
              <span className="text-[10px] font-bold font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                Bengaluru AI Context
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Live context: {selectedStation?.station_name} &bull; AQI {selectedStation?.aqi} ({selectedStation?.category})
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-bold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear Chat
        </button>
      </div>

      {/* Chat Container */}
      <div className="classy-card rounded-3xl p-6 min-h-[480px] flex flex-col justify-between space-y-4 border border-slate-200 shadow-sm">
        {/* Messages Feed */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 font-medium ${
                  m.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-br-none shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line space-y-1">
                  {m.text}
                </div>

                {/* Follow-up Suggestion Chips */}
                {m.followups && m.followups.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-sky-600" /> Suggested Questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.followups.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="bg-white hover:bg-slate-100 text-slate-700 text-[11px] px-3 py-1.5 rounded-xl border border-slate-200 transition text-left font-semibold shadow-xs"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-sky-700" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-purple-600" />
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                <span className="text-xs text-slate-600 font-medium">AeroBot is analyzing environmental telemetry...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-3 border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AeroBot about exercise safety, commute routes, pollution causes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl shadow-sm disabled:opacity-50 transition shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Safety Footnote */}
      <div className="text-center text-[11px] text-slate-500 font-medium">
        AeroBot answers based on published KSPCB & CPCB environmental benchmarks. Non-diagnostic guidance.
      </div>
    </div>
  );
};
