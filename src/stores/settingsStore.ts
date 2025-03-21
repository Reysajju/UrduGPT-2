import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings } from '../types';

interface SettingsState extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      sounds: {
        enabled: true,
        volume: 0.5
      },
      darkMode: false,
      compactMessages: false,
      notifications: true,
      profilePhoto: undefined,
      updateSettings: (newSettings) => set((state) => ({
        ...state,
        ...newSettings,
        sounds: {
          ...state.sounds,
          ...(newSettings.sounds || {})
        }
      }))
    }),
    {
      name: 'chat-settings'
    }
  )
);