import { create } from 'zustand';
import { getAccessTokenFromCookie } from '../lib/axiosInstance';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  checkLoginStatus: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
  checkLoginStatus: () => {
    try {
      const token = getAccessTokenFromCookie();
      set({ isLoggedIn: !!token });
    } catch (e) {
      console.error('checkLoginStatus error:', e); // ✅ 디버깅용
    }
  },
}));
