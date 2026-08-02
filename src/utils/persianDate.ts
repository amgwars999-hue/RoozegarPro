/**
 * Jalali (Persian) Calendar Utilities
 * Accurate conversion algorithms for Jalali <-> Gregorian
 */

import { JalaliDate } from '@/types';

// Jalali leap year detection
export function isJalaliLeap(year: number): boolean {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
  ];
  const jp = breaks.reduce((acc, b, i) => (year < b ? acc - i : acc), year + 2346);
  const jm = ((jp % 2820) + 2820) % 2820;
  const jn = jm < 266 ? Math.floor(jm / 106) + 1 : Math.floor((jm - 6) / 102) + 1;
  return (jn & 3) === 0;
}

export function jalaliDaysInMonth(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isJalaliLeap(year) ? 30 : 29;
}

export function gregorianToJalali(gYear: number, gMonth: number, gDay: number): JalaliDate {
  const gy = gYear - 1600;
  const gm = gMonth - 1;
  const gd = gDay - 1;

  let gDayNo = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);
  for (let i = 0; i < gm; ++i) gDayNo += [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i];
  if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) gDayNo++;
  gDayNo += gd;

  let jDayNo = gDayNo - 79;
  const jNp = Math.floor(jDayNo / 12053);
  jDayNo %= 12053;

  let jy = 979 + 33 * jNp + 4 * Math.floor(jDayNo / 1461);
  jDayNo %= 1461;

  if (jDayNo >= 366) {
    jy += Math.floor((jDayNo - 1) / 365);
    jDayNo = (jDayNo - 1) % 365;
  }

  const jm = jDayNo < 186 ? 1 + Math.floor(jDayNo / 31) : 7 + Math.floor((jDayNo - 186) / 30);
  const jd = 1 + (jDayNo < 186 ? jDayNo % 31 : (jDayNo - 186) % 30);

  return { year: jy, month: jm, day: jd };
}

export function jalaliToGregorian(jYear: number, jMonth: number, jDay: number): Date {
  const jy = jYear - 979;
  const jm = jMonth - 1;
  const jd = jDay - 1;

  let jDayNo = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4);
  for (let i = 0; i < jm; ++i) jDayNo += (i < 6 ? 31 : 30);
  jDayNo += jd;

  let gDayNo = jDayNo + 79;
  const gy = 1600 + 400 * Math.floor(gDayNo / 146097);
  gDayNo %= 146097;

  let leap = true;
  if (gDayNo >= 36525) {
    gDayNo--;
    const gy2 = 100 * Math.floor(gDayNo / 36524);
    gDayNo %= 36524;
    if (gDayNo >= 365) gDayNo++;
    else leap = false;
    gDayNo += gy2;
  }

  gDayNo += 4 * Math.floor(gDayNo / 1461);
  gDayNo %= 1461;

  if (gDayNo >= 366) {
    leap = false;
    gDayNo--;
    gDayNo += Math.floor(gDayNo / 365) * 365;
  }

  const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 12 && gDayNo >= daysInMonth[gm]) {
    gDayNo -= daysInMonth[gm];
    gm++;
  }

  return new Date(gy, gm, gDayNo + 1);
}

export function getTodayJalali(): JalaliDate {
  const now = new Date();
  return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function jalaliMonthStartDayOfWeek(year: number, month: number): number {
  const g = jalaliToGregorian(year, month, 1);
  return g.getDay(); // 0=Sunday
}

export function getJalaliMonthGrid(year: number, month: number): { jDate: JalaliDate; gDate: Date; isCurrentMonth: boolean }[] {
  const daysInMonth = jalaliDaysInMonth(year, month);
  const startDayOfWeek = jalaliMonthStartDayOfWeek(year, month);
  
  const days: { jDate: JalaliDate; gDate: Date; isCurrentMonth: boolean }[] = [];
  
  // Previous month padding
  if (startDayOfWeek > 0) {
    let prevYear = year;
    let prevMonth = month - 1;
    if (prevMonth < 1) { prevMonth = 12; prevYear--; }
    const prevDays = jalaliDaysInMonth(prevYear, prevMonth);
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevDays - i;
      days.push({ jDate: { year: prevYear, month: prevMonth, day: d }, gDate: jalaliToGregorian(prevYear, prevMonth, d), isCurrentMonth: false });
    }
  }
  
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ jDate: { year, month, day: d }, gDate: jalaliToGregorian(year, month, d), isCurrentMonth: true });
  }
  
  // Next month padding to fill 42 cells (6 rows)
  const remaining = 42 - days.length;
  let nextYear = year;
  let nextMonth = month + 1;
  if (nextMonth > 12) { nextMonth = 1; nextYear++; }
  for (let d = 1; d <= remaining; d++) {
    days.push({ jDate: { year: nextYear, month: nextMonth, day: d }, gDate: jalaliToGregorian(nextYear, nextMonth, d), isCurrentMonth: false });
  }
  
  return days;
}

const persianMonthNames = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const persianDayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
const persianDayNamesShort = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export function getPersianMonthName(month: number): string {
  return persianMonthNames[month - 1] || '';
}

export function getPersianDayName(gDate: Date): string {
  return persianDayNames[gDate.getDay()];
}

export function getPersianDayNameShort(gDate: Date): string {
  return persianDayNamesShort[gDate.getDay()];
}

export function toPersianNumber(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/\d/g, (w) => persianDigits[+w]);
}

export function formatJalaliFull(jDate: JalaliDate): string {
  const g = jalaliToGregorian(jDate.year, jDate.month, jDate.day);
  return `${getPersianDayName(g)} ${toPersianNumber(jDate.day)} ${getPersianMonthName(jDate.month)} ${toPersianNumber(jDate.year)}`;
}
