'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface NameInputModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
}

export default function NameInputModal({ isOpen, onSubmit }: NameInputModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Hoş Geldin!</h2>
                <p className="text-gray-600">Kuraya dahil olmak için isminizi girin</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="İsminizi yazın..."
                    maxLength={30}
                    autoFocus
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-600 placeholder:text-stone-400 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {name.length}/30 karakter
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-orange-500 disabled:hover:to-orange-600"
                >
                  Kuraya katıl 🚀
                </button>
              </form>

              <p className="text-xs text-center text-gray-400 mt-4">
                İsminiz diğer katılımcılar tarafından görülecektir
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
