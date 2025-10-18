'use client';

import { supabase } from '@/lib/supabase/client';
import type { Option, ResultData, Room, User } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface RoomContextType {
  room: Room | null;
  users: User[];
  options: Option[];
  loading: boolean;
  initializeRoom: (roomId: string) => Promise<void>;
  addOption: (text: string) => Promise<void>;
  deleteOption: (optionId: string) => Promise<void>;
  makeAdmin: (userId: string) => Promise<void>;
  selectResult: (type: 'winner' | 'loser') => Promise<void>;
  restartRoom: () => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const initializeRoom = async (roomId: string) => {
    setLoading(true);
    try {
      const { data: existingRoom } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (!existingRoom) {
        const { data: newRoom, error } = await supabase
          .from('rooms')
          .insert({ id: roomId, result: null })
          .select()
          .single();

        if (error) throw error;
        setRoom(newRoom as Room);
      } else {
        setRoom(existingRoom as Room);
      }

      const { data: roomUsers } = await supabase
        .from('users')
        .select('*')
        .eq('room_id', roomId)
        .order('joined_at', { ascending: true });

      setUsers(roomUsers || []);

      const { data: roomOptions } = await supabase
        .from('options')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      setOptions(roomOptions || []);

      const newChannel = supabase.channel(`room:${roomId}`);

      newChannel
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'users', filter: `room_id=eq.${roomId}` },
          (payload) => {
            setUsers((prev) => [...prev, payload.new as User]);
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'users', filter: `room_id=eq.${roomId}` },
          (payload) => {
            setUsers((prev) =>
              prev.map((user) => (user.id === payload.new.id ? (payload.new as User) : user))
            );
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'users', filter: `room_id=eq.${roomId}` },
          (payload) => {
            setUsers((prev) => prev.filter((user) => user.id !== payload.old.id));
          }
        );

      newChannel
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'options', filter: `room_id=eq.${roomId}` },
          (payload) => {
            console.log('🆕 Option added:', payload.new);
            setOptions((prev) => [...prev, payload.new as Option]);
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'options', filter: `room_id=eq.${roomId}` },
          (payload) => {
            console.log('🗑️ Option deleted:', payload.old);
            setOptions((prev) => prev.filter((opt) => opt.id !== payload.old.id));
          }
        );

      newChannel.on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          setRoom(payload.new as Room);
        }
      );

      newChannel.subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
      });
      setChannel(newChannel);
    } catch (error) {
      console.error('Error initializing room:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOption = async (text: string) => {
    if (!room) return;

    const { error } = await supabase.from('options').insert({
      room_id: room.id,
      text,
    });

    if (error) {
      console.error('Error adding option:', error);
    }
  };

  const deleteOption = async (optionId: string) => {
    const { error } = await supabase
      .from('options')
      .delete()
      .eq('id', optionId);

    if (error) {
      console.error('Error deleting option:', error);
    }
  };

  const makeAdmin = async (userId: string) => {
    const { error } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('id', userId);

    if (error) {
      console.error('Error making admin:', error);
    }
  };

  const selectResult = async (type: 'winner' | 'loser') => {
    if (!room || options.length === 0) return;

    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOption = options[randomIndex];

    const resultData: ResultData = { type, option_id: selectedOption.id };

    const { error } = await supabase
      .from('rooms')
      .update({ result: resultData as any })
      .eq('id', room.id);

    if (error) {
      console.error('Error selecting result:', error);
    }
  };

  const restartRoom = async () => {
    if (!room) return;

    await supabase.from('rooms').update({ result: null }).eq('id', room.id);
    await supabase.from('options').delete().eq('room_id', room.id);
  };

  useEffect(() => {
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [channel]);

  return (
    <RoomContext.Provider
      value={{
        room,
        users,
        options,
        loading,
        initializeRoom,
        addOption,
        deleteOption,
        makeAdmin,
        selectResult,
        restartRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}
