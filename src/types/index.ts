export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppTheme {
  mode: ThemeMode;
  primary: string;
  background: string;
  surface: string;
  surfaceHighlight: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  isDark: boolean;
}

export type NoteDesignId = 
  | 'original-yellow' | 'original-cream' 
  | 'colorful-red' | 'colorful-orange' | 'colorful-beige' | 'colorful-teal'
  | 'custom-1' | 'custom-2' | 'custom-3';

export interface NoteDesign {
  id: NoteDesignId;
  name: string;
  backgroundColor: string;
  gridColor: string;
  textColor: string;
  accentColor: string;
  isCustom: boolean;
}

export type EventCategory = 
  | 'official-holiday' 
  | 'ancient-iranian' 
  | 'exhibition' 
  | 'business-meeting' 
  | 'personal' 
  | 'reminder' 
  | 'custom';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  color: string;
  jDate: JalaliDate; // stored as Jalali
  gDate: Date;       // stored as Gregorian
  startTime?: string; // HH:mm
  endTime?: string;
  reminders: ReminderConfig[];
  isRecurring: boolean;
  recurringRule?: string;
  location?: string;
  attachments: string[];
  isShared: boolean;
  sharedWith?: string[];
  isPrivate: boolean;
  createdAt: number;
  updatedAt: number;
  voiceNoteUri?: string;
  extractedText?: string; // AI transcribed
}

export interface ReminderConfig {
  id: string;
  minutesBefore: number;
  type: 'notification' | 'sms' | 'email';
  isEnabled: boolean;
  customMessage?: string;
}

export interface DayNote {
  id: string;
  jDate: JalaliDate;
  gDate: Date;
  text?: string;
  svgPaths: string; // JSON array of drawing paths
  designId: NoteDesignId;
  checkboxes: CheckItem[];
  mood?: MoodType;
  photos: string[];
  isLocked: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CheckItem {
  id: string;
  text: string;
  checked: boolean;
}

export type MoodType = 'happy' | 'energetic' | 'neutral' | 'tired' | 'sad' | 'excited';

export interface JalaliDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

export interface CalendarDay {
  jDate: JalaliDate;
  gDate: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoliday: boolean;
  isWeekend: boolean;
  events: CalendarEvent[];
  note?: DayNote;
  holidayName?: string;
}

export interface AppIconOption {
  id: string;
  name: string;
  source: string;
  bgColor: string;
  isPremium?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  profession: string;
  categories: EventCategory[];
  activeCalendars: string[]; // attached external calendars
  themeMode: ThemeMode;
  accentColor: string;
  selectedDesignId: NoteDesignId;
  selectedIconId: string;
  compactNotes: boolean;
  showOnLockScreen: boolean;
  hapticEnabled: boolean;
  cloudSyncEnabled: boolean;
  aiAssistantEnabled: boolean;
}

export interface ExternalCalendar {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  events: CalendarEvent[];
  isSubscribed: boolean;
  color: string;
}
