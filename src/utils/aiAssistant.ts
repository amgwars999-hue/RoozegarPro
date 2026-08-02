import { CalendarEvent, JalaliDate } from '@/types';
import { gregorianToJalali } from './persianDate';

/**
 * AI Assistant Service
 * In production, this connects to OpenAI GPT-4 / Claude / Local LLM
 * For now, we implement a rule-based NLP parser for Persian
 */

interface ParsedEvent {
  title: string;
  jDate: JalaliDate;
  startTime?: string;
  location?: string;
  category: string;
  confidence: number;
}

const persianNumbers: Record<string, string> = {
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

function normalizePersianNumbers(text: string): string {
  return text.replace(/[۰-۹]/g, w => persianNumbers[w] || w);
}

function extractDate(text: string, referenceDate: Date = new Date()): JalaliDate | null {
  const norm = normalizePersianNumbers(text);
  const todayJ = gregorianToJalali(referenceDate.getFullYear(), referenceDate.getMonth() + 1, referenceDate.getDate());
  
  // Patterns: "فردا", "پس‌فردا", "امروز", "۳ شهریور", "۱۵ مهر"
  if (/\bفردا\b/.test(norm)) {
    const gTomorrow = new Date(referenceDate);
    gTomorrow.setDate(gTomorrow.getDate() + 1);
    return gregorianToJalali(gTomorrow.getFullYear(), gTomorrow.getMonth() + 1, gTomorrow.getDate());
  }
  
  if (/\bپس\s*فردا\b/.test(norm)) {
    const gDayAfter = new Date(referenceDate);
    gDayAfter.setDate(gDayAfter.getDate() + 2);
    return gregorianToJalali(gDayAfter.getFullYear(), gDayAfter.getMonth() + 1, gDayAfter.getDate());
  }
  
  if (/\bامروز\b/.test(norm)) {
    return todayJ;
  }
  
  // Pattern: "DD MMMM" or "DD/MM"
  const monthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  const monthRegex = new RegExp(`(\\d{1,2})\\s*(${monthNames.join('|')})`);
  const match = norm.match(monthRegex);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = monthNames.indexOf(match[2]) + 1;
    if (month > 0) {
      return { year: todayJ.year, month, day };
    }
  }
  
  return null;
}

function extractTime(text: string): string | undefined {
  const norm = normalizePersianNumbers(text);
  
  // Pattern: "ساعت ۵ عصر", "۱۷:۳۰", "۵:۰۰ صبح"
  const timeMatch = norm.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    if (/عصر|بعدازظهر|pm/i.test(norm) && hours < 12) hours += 12;
    if (/صبح|قبلازظهر|am/i.test(norm) && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  
  const persianTimeMatch = norm.match(/ساعت\s+(\d{1,2})/);
  if (persianTimeMatch) {
    let hours = parseInt(persianTimeMatch[1], 10);
    if (/عصر|بعدازظهر/.test(norm) && hours < 12) hours += 12;
    return `${String(hours).padStart(2, '0')}:00`;
  }
  
  return undefined;
}

function extractLocation(text: string): string | undefined {
  const locPatterns = [
    /در\s+([\u0600-\u06FF\s]+?)(?:\s+با|\s+ساعت|\s+فردا|$)/,
    /محل\s*:?\s*([\u0600-\u06FF\s]+?)(?:\s+ساعت|$)/,
  ];
  
  for (const pattern of locPatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  // Known locations
  const knownLocations = ['نمایشگاه بین‌المللی', 'تهران', 'اصفهان', 'مشهد', 'شیراز', 'برج میلاد'];
  for (const loc of knownLocations) {
    if (text.includes(loc)) return loc;
  }
  
  return undefined;
}

function determineCategory(text: string): string {
  if (/نمایشگاه|غرفه|اکسپو/.test(text)) return 'exhibition';
  if (/جلسه|ملاقات|قرار|قرارداد/.test(text)) return 'business-meeting';
  if (/تولد|مهمانی|مسافرت/.test(text)) return 'personal';
  if (/تعطیل|مناسبت/.test(text)) return 'official-holiday';
  return 'personal';
}

export function parseNaturalLanguage(input: string): ParsedEvent | null {
  const jDate = extractDate(input);
  if (!jDate) return null;
  
  const startTime = extractTime(input);
  const location = extractLocation(input);
  const category = determineCategory(input);
  
  // Extract title by removing date/time/location markers
  let title = input
    .replace(/فردا|پس\s*فردا|امروز/g, '')
    .replace(/ساعت\s+\d{1,2}(:\d{2})?\s*(صبح|عصر|بعدازظهر)?/g, '')
    .replace(/\d{1,2}\s*(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)/g, '')
    .replace(/در\s+[\u0600-\u06FF\s]+/, '')
    .replace(/با\s+[\u0600-\u06FF\s]+/, '')
    .replace(/دارم|هستم|می‌روم|برویم/, '')
    .trim();
  
  if (title.length < 3) {
    title = category === 'exhibition' ? 'رویداد نمایشگاهی' :
            category === 'business-meeting' ? 'جلسه کاری' : 'رویداد';
  }
  
  return {
    title,
    jDate,
    startTime,
    location,
    category,
    confidence: 0.85,
  };
}

export function generateSmartReminders(event: ParsedEvent): { label: string; minutes: number }[] {
  const suggestions = [
    { label: '۱ ساعت قبل', minutes: 60 },
    { label: '۱ روز قبل', minutes: 1440 },
    { label: '۱۵ دقیقه قبل', minutes: 15 },
  ];
  
  if (event.category === 'exhibition') {
    suggestions.push({ label: '۱ هفته قبل', minutes: 10080 });
  }
  
  return suggestions;
}
