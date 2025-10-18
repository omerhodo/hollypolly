'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface RoomEntranceModalProps {
  isOpen: boolean;
  onSubmit: (name: string, title: string) => void;
  isAdmin: boolean;
  existingTitle?: string;
}

export default function RoomEntranceModal({ isOpen, onSubmit, isAdmin, existingTitle }: RoomEntranceModalProps) {
  const t = useTranslations('entrance');
  const tRoom = useTranslations('room');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && (!isAdmin || title.trim())) {
      onSubmit(name.trim(), title.trim());
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
                {existingTitle && !isAdmin ? (
                  <div className="mt-3">
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                      <h3 className="text-md font-bold text-center text-gray-600">{t('joiningDraw')} <span className="font-mono text-xl font-bold text-orange-600">{existingTitle}</span></h3>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-xl">{isAdmin ? t('createDraw') : t('joinDraw')}</p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isAdmin && (
                  <div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t('drawTitlePlaceholder')}
                      maxLength={50}
                      autoFocus
                      className="w-full px-4 py-3 border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-600 placeholder:text-stone-400 text-lg"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {title.length}/50 {t('characters')}
                    </p>
                  </div>
                )}
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('namePlaceholder')}
                    maxLength={30}
                    autoFocus={!isAdmin}
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-600 placeholder:text-stone-400 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {name.length}/30 {t('characters')}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!name.trim() || (isAdmin && !title.trim())}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-orange-500 disabled:hover:to-orange-600"
                >
                  {isAdmin ? t('createButton') : t('joinButton')}
                </button>
              </form>

              <p className="text-xs text-center text-gray-400 mt-4">
                {t('nameVisibleNote')}
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
