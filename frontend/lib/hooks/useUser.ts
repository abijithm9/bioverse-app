import { useState, useEffect, useCallback } from 'react';
import { User } from '../../app/types';

const USER_KEY = 'user';

export function useUser() {
  const [user, setUserState] = useState<User | null>(null);

  const setUser = useCallback((newUser: User | null) => {
    if (typeof window !== 'undefined') {
      if (newUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    }
    setUserState(newUser);
  }, []);

  const getUser = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem(USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  }, []);

  useEffect(() => {
    setUserState(getUser());
  }, [getUser]);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  return { user, getUser, setUser, logout };
}
