import { AuthContext, type AuthContextValue } from '@features/index';
import { useContext } from 'react';

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
