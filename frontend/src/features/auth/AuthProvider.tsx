import { fetcher } from '@shared/lib/api/fetcher';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { AuthContext } from './AuthContext';

import type { User } from '@/shared/types/user';

const TOKEN_KEY = 'token';

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetcher<User>('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const data = await fetcher<{ access_token: string }>('/auth/jwt/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      localStorage.setItem(TOKEN_KEY, data.access_token);
      await loadUser();
    },
    [loadUser]
  );

  const register = useCallback(
    async (email: string, username: string, password: string): Promise<void> => {
      await fetcher('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, username, password }),
      });
      await login(email, password);
    },
    [login]
  );

  const logout = useCallback((): void => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
