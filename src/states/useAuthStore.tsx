import { create } from 'zustand';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
  login: () => {
    set({ isLoggedIn: true });
  },
  logout: () => {
    const { remove: removeLocalStorage } = useLocalStorage();
    removeLocalStorage('accessToken');
    set({ isLoggedIn: false });
  },
}));
