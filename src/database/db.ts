import * as FileSystem from 'expo-file-system';
import { CalendarEvent, DayNote, UserProfile } from '@/types';

const DB_DIR = FileSystem.documentDirectory + 'roozegar_db/';
const EVENTS_FILE = DB_DIR + 'events.json';
const NOTES_FILE = DB_DIR + 'notes.json';
const PROFILE_FILE = DB_DIR + 'profile.json';

// In-memory cache
let eventsCache: CalendarEvent[] = [];
let notesCache: DayNote[] = [];
let profileCache: UserProfile | null = null;
let initialized = false;

async function ensureDir() {
  const dirInfo = await FileSystem.getInfoAsync(DB_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(DB_DIR, { intermediates: true });
  }
}

async function readJson<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const info = await FileSystem.getInfoAsync(filePath);
    if (!info.exists) return defaultValue;
    const content = await FileSystem.readAsStringAsync(filePath);
    return JSON.parse(content);
  } catch {
    return defaultValue;
  }
}

async function writeJson(filePath: string, data: any) {
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data));
}

export async function initializeDatabase() {
  if (initialized) return;
  await ensureDir();
  
  eventsCache = await readJson<CalendarEvent[]>(EVENTS_FILE, []);
  notesCache = await readJson<DayNote[]>(NOTES_FILE, []);
  profileCache = await readJson<UserProfile | null>(PROFILE_FILE, null);
  
  if (!profileCache) {
    profileCache = {
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
    };
    await writeJson(PROFILE_FILE, profileCache);
  }
  
  initialized = true;
}

// Events
export async function getEvents(): Promise<CalendarEvent[]> {
  if (!initialized) await initializeDatabase();
  return eventsCache;
}

export async function addEvent(event: CalendarEvent) {
  if (!initialized) await initializeDatabase();
  eventsCache.push(event);
  await writeJson(EVENTS_FILE, eventsCache);
}

export async function updateEvent(updated: CalendarEvent) {
  if (!initialized) await initializeDatabase();
  eventsCache = eventsCache.map(e => e.id === updated.id ? updated : e);
  await writeJson(EVENTS_FILE, eventsCache);
}

export async function deleteEvent(id: string) {
  if (!initialized) await initializeDatabase();
  eventsCache = eventsCache.filter(e => e.id !== id);
  await writeJson(EVENTS_FILE, eventsCache);
}

// Notes
export async function getNotes(): Promise<DayNote[]> {
  if (!initialized) await initializeDatabase();
  return notesCache;
}

export async function getNoteForDate(jYear: number, jMonth: number, jDay: number): Promise<DayNote | undefined> {
  if (!initialized) await initializeDatabase();
  return notesCache.find(n => n.jDate.year === jYear && n.jDate.month === jMonth && n.jDate.day === jDay);
}

export async function saveNote(note: DayNote) {
  if (!initialized) await initializeDatabase();
  const idx = notesCache.findIndex(n => n.id === note.id);
  if (idx >= 0) notesCache[idx] = note;
  else notesCache.push(note);
  await writeJson(NOTES_FILE, notesCache);
}

// Profile
export async function getProfile(): Promise<UserProfile | null> {
  if (!initialized) await initializeDatabase();
  return profileCache;
}

export async function updateProfile(partial: Partial<UserProfile>) {
  if (!initialized) await initializeDatabase();
  profileCache = { ...profileCache!, ...partial };
  await writeJson(PROFILE_FILE, profileCache);
}
