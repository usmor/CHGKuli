import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GameStore = {
  guestToken: string | null;
  currentGameId: number | null;
  setGuestToken: (token: string | null) => void;
  setCurrentGameId: (id: number | null) => void;
  reset: () => void;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      guestToken: null,
      currentGameId: null,
      setGuestToken: (token): void => {
        set({ guestToken: token });
      },
      setCurrentGameId: (id): void => {
        set({ currentGameId: id });
      },
      reset: (): void => {
        set({ guestToken: null, currentGameId: null });
      },
    }),
    { name: 'game-store' }
  )
);
