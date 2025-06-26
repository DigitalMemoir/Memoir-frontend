import { create } from 'zustand';

interface IUseDrawer {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useDrawer = create<IUseDrawer>((set) => ({
  isOpen: false,
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
}));
