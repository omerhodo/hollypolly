'use client';

import { supabase } from '@/lib/supabase/client';
import type { User } from '@/types';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  initializeUser: (roomId: string, name?: string) => Promise<User>;
  updateUserName: (userId: string, newName: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('hollypolly_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hollypolly_user');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('hollypolly_user');
    if (storedUser) {
      try {
        setCurrentUserState(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hollypolly_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Random avatar generator (DiceBear API)
  const getRandomAvatar = (seed: string) => {
    const styles = ['adventurer', 'avataaars', 'bottts', 'fun-emoji', 'lorelei', 'notionists', 'personas'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}`;
  };

  const initializeUser = async (roomId: string, name?: string): Promise<User> => {
    if (currentUser && currentUser.room_id === roomId) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (existingUser) {
        return currentUser;
      } else {
        const { count } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('room_id', roomId);

        const shouldBeAdmin = count === 0 || count === null;
        const userToInsert = { ...currentUser, is_admin: shouldBeAdmin, last_seen: new Date().toISOString() };

        const { error } = await supabase.from('users').insert(userToInsert);
        if (!error) {
          setCurrentUser(userToInsert);
          return userToInsert;
        }
      }
    }

    const storedUser = localStorage.getItem('hollypolly_user');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        if (user.room_id === roomId) {
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!existingUser) {
            const { count } = await supabase
              .from('users')
              .select('id', { count: 'exact', head: true })
              .eq('room_id', roomId);

            const shouldBeAdmin = count === 0 || count === null;
            const userToInsert = { ...user, is_admin: shouldBeAdmin, last_seen: new Date().toISOString() };

            const { error } = await supabase.from('users').insert(userToInsert);
            if (!error) {
              setCurrentUser(userToInsert);
              localStorage.setItem('hollypolly_user', JSON.stringify(userToInsert));
              return userToInsert;
            }
          } else {
            setCurrentUser(existingUser as User);
            localStorage.setItem('hollypolly_user', JSON.stringify(existingUser));
            return existingUser as User;
          }
        } else {
          localStorage.removeItem('hollypolly_user');
        }
      } catch (e) {
        localStorage.removeItem('hollypolly_user');
      }
    }

    if (!name) {
      throw new Error('Name is required to create a user');
    }

    const userId = uuidv4();
    const userName = name;
    const avatar = getRandomAvatar(userId);

    const { count } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('room_id', roomId);

    const isAdmin = count === 0 || count === null;

    const newUser: User = {
      id: userId,
      name: userName,
      avatar,
      is_admin: isAdmin,
      room_id: roomId,
      joined_at: new Date().toISOString(),
      last_seen: new Date().toISOString(),
    };

    const { error } = await supabase.from('users').insert(newUser);

    if (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }

    const { error: optionError } = await supabase.from('options').insert({
      room_id: roomId,
      text: userName,
    });

    if (optionError) {
      console.error('⚠️ Error creating user option:', optionError);
      // Option hatası kullanıcı oluşturmayı engellemez
    }

    setCurrentUser(newUser);
    localStorage.setItem('hollypolly_user', JSON.stringify(newUser));
    return newUser;
  };

  const updateUserName = async (userId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ name: newName })
        .eq('id', userId);

      if (error) throw error;

      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, name: newName };
        setCurrentUser(updatedUser);
        localStorage.setItem('hollypolly_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user name:', error);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, initializeUser, updateUserName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
