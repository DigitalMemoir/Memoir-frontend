import { create } from 'zustand';

interface IUseDrawerStore {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<IUseDrawerStore>((set) => ({
  isOpen: false,
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
}));
