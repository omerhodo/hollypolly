'use client';

import { useRoom } from '@/contexts/RoomContext';
import { useUser } from '@/contexts/UserContext';
import type { User } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface UserListProps {
  users: User[];
  currentUser: User | null;
}

export default function UserList({ users, currentUser }: UserListProps) {
  const { makeAdmin } = useRoom();
  const { updateUserName } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(currentUser?.name || '');
  const isCurrentUserAdmin = currentUser?.is_admin || false;

  const handleMakeAdmin = async (userId: string) => {
    if (isCurrentUserAdmin && userId !== currentUser?.id) {
      await makeAdmin(userId);
    }
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !currentUser) return;

    await updateUserName(currentUser.id, newName.trim());
    setIsEditingName(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        👥 Katılımcılar
        <span className="text-sm font-normal text-gray-500">({users.length})</span>
      </h2>

      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-orange-100 rounded-xl border-2 border-orange-400"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm">
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                {isEditingName ? (
                  <form onSubmit={handleNameUpdate} className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-orange-600 placeholder:text-stone-400"
                      autoFocus
                      maxLength={30}
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(currentUser.name);
                      }}
                      className="px-2 py-1 bg-stone-300 text-stone-700 text-xs rounded hover:bg-stone-400"
                    >
                      ✕
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{currentUser.name}</p>
                    {currentUser.is_admin && (
                      <span className="text-yellow-500" title="Admin">
                        👑
                      </span>
                    )}
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-xs text-orange-600 hover:text-orange-800"
                      title="İsmi düzenle"
                    >
                      ✏️
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded-full font-semibold">
                    Siz
                  </span>
                  <p className="text-xs text-gray-500">
                    {new Date(currentUser.joined_at).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {users
          .filter((user) => user.id !== currentUser?.id)
          .map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-stone-100 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    {user.is_admin && (
                      <span className="text-yellow-500" title="Admin">
                        👑
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(user.joined_at).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {isCurrentUserAdmin && !user.is_admin && (
                <button
                  onClick={() => handleMakeAdmin(user.id)}
                  className="text-xs bg-orange-200 hover:bg-orange-300 text-orange-800 px-3 py-1 rounded-full transition-colors"
                >
                  Admin Yap
                </button>
              )}
            </motion.div>
          ))}

        {users.filter((user) => user.id !== currentUser?.id).length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Henüz başka katılımcı yok. Kura çekme odası linkini paylaşın!
          </div>
        )}
      </div>
    </div>
  );
}
