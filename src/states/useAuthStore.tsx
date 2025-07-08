import { create } from 'zustand';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  checkLoginStatus: () => void;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
  login: () => {
    const fullHash = window.location.hash;
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const { set: setLocalStorage } = useLocalStorage();
    if (token) {
      setLocalStorage('accessToken', token);
    }
    window.location.href = `${window.location.origin}${window.location.pathname}${fullHash}`;
    set({ isLoggedIn: true });
  },
  logout: () => {
    const { remove: removeLocalStorage } = useLocalStorage();
    removeLocalStorage('accessToken');
    set({ isLoggedIn: false });
  },
  checkLoginStatus: () => {
    const { get: getLocalStorage } = useLocalStorage();
    const accessToken = getLocalStorage<string>('accessToken');
    set({ isLoggedIn: !!accessToken });
  },
}));
