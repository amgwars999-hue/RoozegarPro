import { create } from 'zustand';
import { UserProfile, NoteDesignId, ThemeMode } from '@/types';

interface AppState {
  profile: UserProfile;
  compactNotes: boolean;
  showOnLockScreen: boolean;
  hapticEnabled: boolean;
  cloudSyncEnabled: boolean;
  aiAssistantEnabled: boolean;
  stats: {
    totalChars: number;
    pages: number;
    usageDays: number;
    startDate: string;
  };
  
  // Actions
  setCompactNotes: (val: boolean) => void;
  setShowOnLockScreen: (val: boolean) => void;
  setHapticEnabled: (val: boolean) => void;
  setCloudSyncEnabled: (val: boolean) => void;
  setAiAssistantEnabled: (val: boolean) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  incrementStats: (chars: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  profile: {
    id: 'user-1',
    name: 'کاربر',
    profession: 'عمومی',
    categories: ['official-holiday', 'personal', 'business-meeting'],
    activeCalendars: [],
    themeMode: 'system',
    accentColor: '#C8E636',
    selectedDesignId: 'original-yellow',
    selectedIconId: 'default',
    compactNotes: false,
    showOnLockScreen: true,
    hapticEnabled: true,
    cloudSyncEnabled: false,
    aiAssistantEnabled: true,
  },
  compactNotes: false,
  showOnLockScreen: true,
  hapticEnabled: true,
  cloudSyncEnabled: false,
  aiAssistantEnabled: true,
  stats: {
    totalChars: 85,
    pages: 0,
    usageDays: 11,
    startDate: '۲۳ تیر ۱۴۰۵',
  },
  
  setCompactNotes: (val) => set({ compactNotes: val }),
  setShowOnLockScreen: (val) => set({ showOnLockScreen: val }),
  setHapticEnabled: (val) => set({ hapticEnabled: val }),
  setCloudSyncEnabled: (val) => set({ cloudSyncEnabled: val }),
  setAiAssistantEnabled: (val) => set({ aiAssistantEnabled: val }),
  updateProfile: (partial) => set((state) => ({ profile: { ...state.profile, ...partial } })),
  incrementStats: (chars) => set((state) => ({
    stats: {
      ...state.stats,
      totalChars: state.stats.totalChars + chars,
      pages: Math.floor((state.stats.totalChars + chars) / 500),
    }
  })),
}));
