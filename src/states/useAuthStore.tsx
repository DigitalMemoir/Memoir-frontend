import { create } from 'zustand';

interface IAuthStore {
  isLoggedIn: boolean;
  userId: string | null;
  setIsLoggedIn: (_isLoggedIn: boolean) => void;
  setUserId: (_userId: string | null) => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  isLoggedIn: false,
  userId: null,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setUserId: (userId) => set({ userId }),
}));
