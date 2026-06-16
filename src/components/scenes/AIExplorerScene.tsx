'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/useStore';
import { Send, Bot, User, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

interface EventData {
  title: string;
  category: string;
  prize: string;
  fee: number; // numerical value for comparison
  feeText: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hasCertificate: boolean;
  desc: string;
}

const EVENTS_DATABASE: EventData[] = [
  { title: 'Genesis Hackathon', category: 'Technical', prize: '₹50,000 Pool', fee: 300, feeText: '₹300', difficulty: 'Hard', hasCertificate: true, desc: 'Flagship Web3 and software development marathon.' },
  { title: 'AI Arena', category: 'Technical', prize: '₹30,000 Pool', fee: 150, feeText: '₹150', difficulty: 'Medium', hasCertificate: true, desc: 'Machine learning automation agent battle.' },
  { title: 'Cyber Security CTF', category: 'Technical', prize: '₹20,000 Pool', fee: 0, feeText: 'Free', difficulty: 'Hard', hasCertificate: true, desc: 'Information security CTF flags hacking contest.' },
  { title: 'Beat Drop Street Dance', category: 'Cultural', prize: '₹40,000 Pool', fee: 500, feeText: '₹500', difficulty: 'Medium', hasCertificate: false, desc: 'High energy crew street dance face-off.' },
  { title: 'Acoustic Soul', category: 'Cultural', prize: '₹15,000 Pool', fee: 100, feeText: '₹100', difficulty: 'Easy', hasCertificate: false, desc: 'Live unplugged voice and string covers.' },
  { title: 'Runway Redefined', category: 'Cultural', prize: '₹35,000 Pool', fee: 600, feeText: '₹600', difficulty: 'Medium', hasCertificate: false, desc: 'Eco-friendly recycled material costume walk.' },
  { title: 'Valorant Showdown', category: 'Gaming', prize: '₹25,000 Pool', fee: 250, feeText: '₹250', difficulty: 'Hard', hasCertificate: false, desc: '5v5 custom server lobbies tactical search and destroy.' },
  { title: 'BGMI Clash', category: 'Gaming', prize: '₹20,000 Pool', fee: 200, feeText: '₹200', difficulty: 'Medium', hasCertificate: false, desc: 'Squad battle royale tournament.' },
  { title: 'Build Your Own Drone', category: 'Workshops', prize: 'Certificate', fee: 400, feeText: '₹400', difficulty: 'Easy', hasCertificate: true, desc: 'Hands-on drone assembly and flight telemetry tutorial.' },
  { title: 'UI/UX Glassmorphism', category: 'Workshops', prize: 'Certificate', fee: 0, feeText: 'Free', difficulty: 'Easy', hasCertificate: true, desc: 'Elite dynamic interface prototyping.' },
  { title: 'Futsal League', category: 'Sports', prize: '₹15,000 Pool', fee: 300, feeText: '₹300', difficulty: 'Medium', hasCertificate: false, desc: '5-a-side rapid football play.' },
  { title: '3v3 Hoop Shot', category: 'Sports', prize: '₹10,000 Pool', fee: 200, feeText: '₹200', difficulty: 'Medium', hasCertificate: false, desc: 'Half-court basketball shootouts.' }
];

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  results?: EventData[];
}

export default function AIExplorerScene() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: "Hey! I am the Yuvenza Wellness AI Explorer. Ask me anything, for example: 'mindfulness workshops with certificates', 'physical vitality events' or 'beginner yoga friendly'."
    }
  ]);
  const registerForEvent = useStore((state) => state.registerForEvent);
  const addPoints = useStore((state) => state.addPoints);

  const handleQuery = (textQuery: string) => {
    if (!textQuery.trim()) return;

    const lower = textQuery.toLowerCase();
    let matched = [...EVENTS_DATABASE];
    let reply = "Here are the events I found matching your criteria:";

    // Parse category
    if (lower.includes('game') || lower.includes('gaming')) {
      matched = matched.filter(e => e.category === 'Gaming');
    } else if (lower.includes('tech') || lower.includes('technical') || lower.includes('hackathon')) {
      matched = matched.filter(e => e.category === 'Technical');
    } else if (lower.includes('cult') || lower.includes('cultural') || lower.includes('dance') || lower.includes('music')) {
      matched = matched.filter(e => e.category === 'Cultural');
    } else if (lower.includes('workshop') || lower.includes('workshops') || lower.includes('learn')) {
      matched = matched.filter(e => e.category === 'Workshops');
    } else if (lower.includes('sport') || lower.includes('sports')) {
      matched = matched.filter(e => e.category === 'Sports');
    }

    // Parse certificate
    if (lower.includes('certificate') || lower.includes('certificates') || lower.includes('certification')) {
      matched = matched.filter(e => e.hasCertificate);
      reply = "These workshops and sessions provide certificates upon completion:";
    }

    // Parse difficulty
    if (lower.includes('first year') || lower.includes('first-year') || lower.includes('easy') || lower.includes('beginner')) {
      matched = matched.filter(e => e.difficulty === 'Easy');
      reply = "These beginner-friendly events are perfect for first years:";
    } else if (lower.includes('hard') || lower.includes('expert') || lower.includes('pro')) {
      matched = matched.filter(e => e.difficulty === 'Hard');
    }

    // Parse price limits (e.g. under 300)
    const priceMatch = lower.match(/(?:under|below|less than|max|₹)\s?(\d+)/);
    if (priceMatch) {
      const limit = parseInt(priceMatch[1], 10);
      matched = matched.filter(e => e.fee <= limit);
      reply = `I found these events that fit a budget under ₹${limit}:`;
    } else if (lower.includes('free') || lower.includes('no fee') || lower.includes('₹0')) {
      matched = matched.filter(e => e.fee === 0);
      reply = "Here are all our free entry events:";
    }

    // No matches
    if (matched.length === 0) {
      reply = "I couldn't find any events matching that exact description. Try something like 'gaming events under 250' or 'free workshops'!";
    }

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: textQuery },
      { sender: 'bot', text: reply, results: matched.length > 0 ? matched : undefined }
    ]);
    
    addPoints(15, 'Using AI event finder agent');
    setQuery('');
  };

  return (
    <section id="explorer" className="relative py-24 bg-[#011213] px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-12">
            <h2>
              <Bot className="w-8 sm:w-12 h-8 sm:h-12 text-teal-400" />
              <span>AI WELLNESS <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">EXPLORER</span></span>
            </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Find the perfect events instantly using conversational search tags.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[550px] shadow-2xl backdrop-blur-xl">
          
          {/* Header */}
          <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-xs text-gray-300 font-semibold tracking-wider uppercase">Wellness Guide Assistant</span>
            </div>
            <Sparkles className="w-4 h-4 text-teal-400" />
          </div>

          {/* Messages Feed */}
          <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Avatar */}
                <div className={`p-2 rounded-full border h-9 w-9 flex-shrink-0 flex items-center justify-center ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-3">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Attachment Cards (Bot search results) */}
                  {msg.results && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 w-[280px] sm:w-[450px]">
                      {msg.results.map((e, index) => (
                        <div 
                          key={index}
                          className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[9px] uppercase font-bold tracking-widest text-purple-400">{e.category}</span>
                              <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-mono">{e.difficulty}</span>
                            </div>
                            <h4 className="text-white text-xs font-bold mb-1">{e.title}</h4>
                            <p className="text-[10px] text-gray-400 mb-3">{e.desc}</p>
                          </div>
                          <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2 mt-auto">
                            <span className="text-[10px] text-emerald-400 font-bold">Fee: {e.feeText}</span>
                            <button
                              onClick={() => registerForEvent(e.title)}
                              className="text-[10px] bg-white text-black font-extrabold px-3 py-1 rounded hover:bg-teal-500 hover:text-white transition-all"
                            >
                              Register
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Recommendation Tags */}
          <div className="px-6 py-3 border-t border-white/5 bg-white/5 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none select-none">
            <button
              onClick={() => handleQuery('gaming events under 300')}
              className="text-[10px] font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
            >
              🎮 Gaming under ₹300
            </button>
            <button
              onClick={() => handleQuery('workshops with certificates')}
              className="text-[10px] font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
            >
              📚 Wellness Workshops
            </button>
            <button
              onClick={() => handleQuery('easy events for first years')}
              className="text-[10px] font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
            >
              🌱 Beginner Friendly
            </button>
            <button
              onClick={() => handleQuery('free technical events')}
              className="text-[10px] font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
            >
              💻 Free Mind Challenges
            </button>
          </div>

          {/* Input Box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleQuery(query); }}
            className="px-6 py-4 border-t border-white/10 flex gap-3"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about the festival events..."
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-black hover:bg-teal-500 hover:text-white px-4 rounded-xl flex items-center justify-center transition-all shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </section>
  );
}
