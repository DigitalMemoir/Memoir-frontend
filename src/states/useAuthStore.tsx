import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  checkLoginStatus: () => void;
}

// http only 쿠키이므로 이후 수정 필요
export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
  checkLoginStatus: () => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='));
    if (token) {
      set({ isLoggedIn: true });
    } else {
      set({ isLoggedIn: false });
    }
  },
}));
