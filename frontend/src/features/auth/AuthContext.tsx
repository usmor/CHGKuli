import { createContext } from 'react';

import type { User } from '@shared/types/user';

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
