import { create } from 'zustand';
import type { IProfile } from '../types/IProfile';

export const useProfile = create<{
  profile: IProfile | null;
  setProfile: (profile: IProfile) => void;
}>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
