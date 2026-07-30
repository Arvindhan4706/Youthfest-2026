'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Inbox } from 'lucide-react';
import { useStore } from '../../lib/useStore';

export default function InboxSection() {
  const messages = useStore((state) => state.messages);
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch w-full">
      {/* Email list */}
      <div className="md:col-span-6 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <Inbox className="w-5 h-5 text-purple-400" />
            <span>Registration Inbox</span>
          </h2>
          
          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1" data-lenis-prevent="true">
            {messages.length === 0 ? (
              <p className="text-xs text-gray-500 py-10 text-center leading-relaxed">
                Your inbox is empty.<br />
                Complete event registrations to receive secure email receipts.
              </p>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => setSelectedMailId(msg.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedMailId === msg.id
                      ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-teal-400 font-bold uppercase font-mono tracking-wider">
                      {msg.amountPaid === '₹0 (Free Registration)' ? 'Free Spot' : 'Paid Receipt'}
                    </span>
                    <span className="text-[8px] text-gray-500 font-mono">
                      {new Date(msg.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1 truncate">{msg.subject}</h4>
                  <p className="text-[9px] text-gray-400 line-clamp-1">{msg.eventTitle} • Status: CONFIRMED</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Expanded mail content */}
      <div className="md:col-span-6">
        {selectedMailId && messages.find(m => m.id === selectedMailId) ? (() => {
          const mail = messages.find(m => m.id === selectedMailId)!;
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full bg-gradient-to-b from-purple-900/10 to-[#030712] border border-purple-500/20 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden min-h-[350px]"
            >
              <div>
                <div className="border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/25 flex items-center justify-center text-purple-400">
                      <MailOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">Yuvenza &apos;26 Registrations</h4>
                      <span className="text-[9px] text-gray-500">From: registrations@yuvenza.org</span>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-black text-white uppercase mt-3">{mail.subject}</h3>
                  <span className="text-[9px] text-gray-500 block mt-1 font-mono">To: {mail.recipientEmail}</span>
                </div>
                
                <div className="max-h-[220px] overflow-y-auto pr-1" data-lenis-prevent="true">
                  <pre className="text-[10px] text-gray-300 font-mono whitespace-pre-wrap leading-relaxed select-text">
                    {mail.body}
                  </pre>
                </div>
              </div>
              
              <div className="border-t border-white/5 pt-4 mt-4 text-[9px] font-mono text-gray-600 flex justify-between items-center">
                <span>Secure mail digital signature: verified</span>
                <span>{mail.id}</span>
              </div>
            </motion.div>
          );
        })() : (
          <div className="w-full h-full border border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-black/10 min-h-[350px]">
            <Mail className="w-8 h-8 text-gray-600 mb-3 animate-pulse" />
            <h4 className="text-sm font-bold text-gray-400">Read Confirmation Mails</h4>
            <p className="text-[10px] text-gray-500 mt-1 max-w-[170px] leading-relaxed">
              Select an email from your registration inbox on the left to read full receipts and details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
