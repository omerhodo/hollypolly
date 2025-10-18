'use client';

import { useRoom } from '@/contexts/RoomContext';
import type { Option, User } from '@/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface OptionListProps {
  options: Option[];
  users: User[];
  currentUser: User | null;
  roomTitle?: string;
}

export default function OptionList({ options, users, currentUser, roomTitle }: OptionListProps) {
  const { addOption, deleteOption, selectResult } = useRoom();
  const [newOption, setNewOption] = useState('');
  const isAdmin = currentUser?.is_admin || false;

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOption.trim()) return;

    await addOption(newOption.trim());
    setNewOption('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        {roomTitle && (
          <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
            <h3 className="text-md font-bold text-center text-gray-600">🎯 Kura Adı: <span className="font-mono text-xl font-bold text-orange-600">{roomTitle}</span></h3>
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Seçenekler</h2>

        <form onSubmit={handleAddOption} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Yeni seçenek ekle..."
              className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-orange-600 placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={!newOption.trim()}
              className="px-6 py-2 bg-white border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 hover:border-orange-600 disabled:border-stone-300 disabled:text-stone-400 disabled:cursor-not-allowed transition-all"
            >
              Ekle
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-stone-50 rounded-lg border border-stone-200 hover:bg-orange-50 hover:border-orange-300 transition-colors flex items-center justify-between gap-3"
            >
              <p className="text-gray-800 font-medium flex-1">{option.text}</p>
              {isAdmin && (
                <button
                  onClick={() => deleteOption(option.id)}
                  className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-red-500 hover:border-red-600 cursor-pointer"
                  title="Sil"
                >
                  🗑️
                </button>
              )}
            </motion.div>
          ))}

          {options.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              Seçenek ekleyerek başlayın
            </div>
          )}
        </div>
      </div>

      {isAdmin && options.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Sonuç Seç</h3>
          <p className="text-sm text-gray-600 mb-4">
            Butona tıklayınca seçenekler arasından rastgele kazanan veya kaybeden seçilir
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => selectResult('winner')}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
            >
              🏆 Kazanan Seç
            </button>
            <button
              onClick={() => selectResult('loser')}
              className="flex-1 px-6 py-4 bg-white border-2 border-red-500 hover:border-red-600 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all font-bold shadow-sm hover:shadow-md transform hover:scale-105 text-lg"
            >
              💔 Kaybeden Seç
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
