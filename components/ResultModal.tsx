'use client';

import { useRoom } from '@/contexts/RoomContext';
import type { Option, ResultData } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

interface ResultModalProps {
  result: ResultData;
  options: Option[];
}

export default function ResultModal({ result, options }: ResultModalProps) {
  const { restartRoom } = useRoom();

  const selectedOption = options.find((o) => o.id === result.option_id);
  const isWinner = result.type === 'winner';

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        restartRoom();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [restartRoom]);

  if (!selectedOption) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            restartRoom();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-orange-200"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-8xl mb-4"
            >
              {isWinner ? '🎉' : '💔'}
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-3xl font-bold mb-2 ${
                isWinner ? 'text-orange-600' : 'text-red-600'
              }`}
            >
              {isWinner ? 'Kazanan!' : 'Kaybeden!'}
            </motion.h2>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-4 my-6"
            >
              <div className="text-6xl">
                {isWinner ? '🏆' : '💔'}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{selectedOption.text}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={restartRoom}
                className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🔄 Tekrar Başlat
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
