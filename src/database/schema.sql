-- Roozegar Pro Database Schema (SQLite)

-- Users / Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'کاربر',
  profession TEXT,
  theme_mode TEXT DEFAULT 'system',
  accent_color TEXT DEFAULT '#C8E636',
  selected_design_id TEXT DEFAULT 'original-yellow',
  selected_icon_id TEXT DEFAULT 'default',
  compact_notes INTEGER DEFAULT 0,
  show_on_lock_screen INTEGER DEFAULT 1,
  haptic_enabled INTEGER DEFAULT 1,
  cloud_sync_enabled INTEGER DEFAULT 0,
  ai_assistant_enabled INTEGER DEFAULT 1,
  created_at INTEGER,
  updated_at INTEGER
);

-- Calendar Events
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'personal',
  color TEXT DEFAULT '#C8E636',
  j_year INTEGER NOT NULL,
  j_month INTEGER NOT NULL,
  j_day INTEGER NOT NULL,
  g_date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  is_recurring INTEGER DEFAULT 0,
  recurring_rule TEXT,
  location TEXT,
  is_shared INTEGER DEFAULT 0,
  is_private INTEGER DEFAULT 0,
  voice_note_uri TEXT,
  extracted_text TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- Event Reminders
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  minutes_before INTEGER NOT NULL DEFAULT 60,
  type TEXT DEFAULT 'notification',
  is_enabled INTEGER DEFAULT 1,
  custom_message TEXT,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Day Notes (handwritten + text)
CREATE TABLE IF NOT EXISTS day_notes (
  id TEXT PRIMARY KEY,
  j_year INTEGER NOT NULL,
  j_month INTEGER NOT NULL,
  j_day INTEGER NOT NULL,
  g_date TEXT NOT NULL,
  text_content TEXT,
  svg_paths TEXT, -- JSON array of drawing paths
  design_id TEXT DEFAULT 'original-yellow',
  mood TEXT,
  is_locked INTEGER DEFAULT 0,
  created_at INTEGER,
  updated_at INTEGER
);

-- Checklists inside notes
CREATE TABLE IF NOT EXISTS check_items (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL,
  text TEXT,
  checked INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (note_id) REFERENCES day_notes(id) ON DELETE CASCADE
);

-- Photos attached to notes
CREATE TABLE IF NOT EXISTS note_photos (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL,
  uri TEXT NOT NULL,
  caption TEXT,
  created_at INTEGER,
  FOREIGN KEY (note_id) REFERENCES day_notes(id) ON DELETE CASCADE
);

-- External Calendars
CREATE TABLE IF NOT EXISTS external_calendars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  source_url TEXT,
  color TEXT,
  is_subscribed INTEGER DEFAULT 1,
  last_sync_at INTEGER
);

-- Shared calendar memberships
CREATE TABLE IF NOT EXISTS shared_calendars (
  id TEXT PRIMARY KEY,
  calendar_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  permission TEXT DEFAULT 'read', -- read, write, admin
  invited_at INTEGER,
  accepted_at INTEGER
);

-- App usage stats
CREATE TABLE IF NOT EXISTS app_stats (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total_chars INTEGER DEFAULT 0,
  pages INTEGER DEFAULT 0,
  usage_days INTEGER DEFAULT 0,
  start_date TEXT,
  last_opened INTEGER
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_jdate ON events(j_year, j_month, j_day);
CREATE INDEX IF NOT EXISTS idx_notes_jdate ON day_notes(j_year, j_month, j_day);
CREATE INDEX IF NOT EXISTS idx_reminders_event ON reminders(event_id);
