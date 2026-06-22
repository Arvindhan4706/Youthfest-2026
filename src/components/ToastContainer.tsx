'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore, ToastMessage } from '../lib/useStore';
import { Award, Zap, X } from 'lucide-react';

export default function ToastContainer() {
  const toasts = useStore((state) => state.toasts);
  const removeToast = useStore((state) => state.removeToast);


  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl flex items-start gap-3 relative overflow-hidden group"
          >
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            
            <div className="flex-shrink-0 mt-0.5">
              {toast.badge ? (
                <div className="bg-yellow-500/20 text-yellow-400 p-2 rounded-lg border border-yellow-500/30">
                  <Award className="w-5 h-5" />
                </div>
              ) : (
                <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg border border-blue-500/30">
                  <Zap className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="flex-grow">
              <p className="text-white text-sm font-medium leading-relaxed">{toast.message}</p>

            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white text-xs flex-shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
