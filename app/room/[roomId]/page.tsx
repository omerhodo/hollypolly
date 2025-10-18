'use client';

import OptionList from '@/components/OptionList';
import ResultModal from '@/components/ResultModal';
import RoomEntranceModal from '@/components/RoomEntranceModal';
import UserList from '@/components/UserList';
import { useRoom } from '@/contexts/RoomContext';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RoomPage() {
  const t = useTranslations();
  const params = useParams();
  const roomId = params.roomId as string;
  const { currentUser, initializeUser } = useUser();
  const { room, users, options, loading, initializeRoom, updateRoomTitle } = useRoom();
  const [initializing, setInitializing] = useState(true);
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isFirstUser, setIsFirstUser] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let hasInitialized = false;

    const init = async () => {
      if (!isMounted || hasInitialized) return;
      hasInitialized = true;
      setInitializing(true);

      try {
        await initializeRoom(roomId);

        if (currentUser && currentUser.room_id === roomId) {
          setInitializing(false);
          return;
        }

        const storedUser = localStorage.getItem('hollypolly_user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            if (user.room_id === roomId && user.name && user.id) {
              const { data: existingUser } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .eq('room_id', roomId)
                .single();

              if (existingUser) {
                await initializeUser(roomId, user.name);
                setInitializing(false);
                return;
              } else {
                console.log('🗑️ User not in DB, clearing storage');
                localStorage.removeItem('hollypolly_user');
              }
            }
          } catch (e) {
            console.error('Error checking stored user:', e);
            localStorage.removeItem('hollypolly_user');
          }
        }

        const { count } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('room_id', roomId);

        const willBeAdmin = count === 0 || count === null;
        setIsFirstUser(willBeAdmin);
        setShowNameModal(true);
        setInitializing(false);
      } catch (error) {
        console.error('❌ Error initializing:', error);
        setInitializing(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [roomId, currentUser]);

  const handleNameSubmit = async (name: string, title: string) => {
    setUserName(name);
    setShowNameModal(false);
    setInitializing(true);

    try {
      await initializeUser(roomId, name);

      if (title && isFirstUser) {
        await updateRoomTitle(title);
      }

      console.log('✅ User initialized with name:', name);
    } catch (error) {
      console.error('❌ Error creating user:', error);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const updateHeartbeat = async () => {
      await supabase
        .from('users')
        .update({ last_seen: new Date().toISOString() } as any)
        .eq('id', currentUser.id);
    };

    updateHeartbeat();

    const interval = setInterval(updateHeartbeat, 30000);

    const handleBeforeUnload = () => {
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?id=eq.${currentUser.id}`, {
        method: 'DELETE',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Content-Type': 'application/json',
        },
        keepalive: true,
      }).catch(() => {
        supabase.from('users').delete().eq('id', currentUser.id);
      });
      localStorage.removeItem('hollypolly_user');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      supabase.from('users').delete().eq('id', currentUser.id);
      localStorage.removeItem('hollypolly_user');
    };
  }, [currentUser]);

  if (showNameModal && !initializing && !currentUser) {
    return (
      <RoomEntranceModal
        isOpen={showNameModal}
        onSubmit={handleNameSubmit}
        isAdmin={isFirstUser}
        existingTitle={room?.title}
      />
    );
  }

  if (initializing || loading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loading.roomLoading')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <UserList users={users} currentUser={currentUser} roomId={roomId} />
          </div>

          <div className="lg:col-span-2">
            <OptionList
              options={options}
              users={users}
              currentUser={currentUser}
              roomTitle={room?.title}
            />
          </div>
        </div>
      </motion.div>

      {room?.result && (
        <ResultModal
          result={room.result}
          options={options}
        />
      )}
    </div>
  );
}
