import { create } from 'zustand';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  checkLoginStatus: () => void;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
  login: () => {
    const fullHash = window.location.hash;
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const newUser = queryParams.get('newUser');
    const { set: setLocalStorage } = useLocalStorage();
    if (get().isLoggedIn) return;
    if (token) {
      setLocalStorage('accessToken', token);
      if (newUser == 'true')
        history.replaceState(
          null,
          '',
          window.location.pathname + '#/onboarding'
        );
      else history.replaceState(null, '', window.location.pathname + fullHash);
    }
    set({ isLoggedIn: true });
  },
  logout: () => {
    const { remove: removeLocalStorage } = useLocalStorage();
    removeLocalStorage('accessToken');
    set({ isLoggedIn: false });
  },
  checkLoginStatus: () => {
    const { get: getLocalStorage } = useLocalStorage();
    const accessToken = getLocalStorage('accessToken');
    set({ isLoggedIn: !!accessToken });
  },
}));
