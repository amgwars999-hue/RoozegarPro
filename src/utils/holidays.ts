import { JalaliDate } from '@/types';

export interface HolidayInfo {
  title: string;
  type: 'official' | 'ancient' | 'religious' | 'international';
  isHoliday: boolean;
}

// Official Iranian holidays and ancient celebrations
const holidays: Record<string, HolidayInfo[]> = {
  '1-1': [{ title: 'جشن نوروز', type: 'official', isHoliday: true }],
  '1-2': [{ title: 'عید نوروز', type: 'official', isHoliday: true }],
  '1-3': [{ title: 'عید نوروز', type: 'official', isHoliday: true }],
  '1-4': [{ title: 'عید نوروز', type: 'official', isHoliday: true }],
  '1-12': [{ title: 'روز جمهوری اسلامی', type: 'official', isHoliday: true }],
  '1-13': [{ title: 'جشن سیزده‌به‌در', type: 'official', isHoliday: true }],
  '1-6': [{ title: 'جشن نوروز', type: 'ancient', isHoliday: false }],
  '1-10': [{ title: 'جشن آبان‌گاه', type: 'ancient', isHoliday: false }],
  
  '2-28': [{ title: 'روز بزرگداشت خیام', type: 'official', isHoliday: false }],
  
  '3-14': [{ title: 'رحلت امام خمینی', type: 'official', isHoliday: true }],
  '3-15': [{ title: 'قیام ۱۵ خرداد', type: 'official', isHoliday: true }],
  '3-29': [{ title: 'جشن آب‌پاشونک', type: 'ancient', isHoliday: false }],
  '3-31': [{ title: 'جشن چله تابستان', type: 'ancient', isHoliday: false }],
  
  '4-7': [{ title: 'جشن خاموشی', type: 'ancient', isHoliday: false }],
  '4-13': [{ title: 'جشن چلهٔ گرم', type: 'ancient', isHoliday: false }],
  
  '5-16': [{ title: 'جشن مهرگان', type: 'ancient', isHoliday: false }],
  '5-28': [{ title: 'جشن تیرگان', type: 'ancient', isHoliday: false }],
  
  '6-1': [{ title: 'جشن شهریورگان', type: 'ancient', isHoliday: false }],
  '6-4': [{ title: 'جشن چلهٔ سرد', type: 'ancient', isHoliday: false }],
  '6-15': [{ title: 'جشن آبان‌گان', type: 'ancient', isHoliday: false }],
  '6-25': [{ title: 'جشن فروردین‌گان', type: 'ancient', isHoliday: false }],
  '6-31': [{ title: 'جشن هالووین ایرانی', type: 'ancient', isHoliday: false }],
  
  '7-8': [{ title: 'جشن مهرگان بزرگ', type: 'ancient', isHoliday: false }],
  '7-16': [{ title: 'جشن آذرگان', type: 'ancient', isHoliday: false }],
  '7-26': [{ title: 'جشن سده', type: 'ancient', isHoliday: false }],
  
  '8-3': [{ title: 'جشن اسفندی/سپندارمذگان', type: 'ancient', isHoliday: false }],
  '8-10': [{ title: 'جشن بهمنگان', type: 'ancient', isHoliday: false }],
  '8-15': [{ title: 'جشن شهریورگان', type: 'ancient', isHoliday: false }],
  '8-24': [{ title: 'چهارشنبه‌سوری', type: 'ancient', isHoliday: false }],
  
  '9-1': [{ title: 'جشن نوروز/حمل', type: 'ancient', isHoliday: false }],
  '9-5': [{ title: 'جشن گیاه‌آوری', type: 'ancient', isHoliday: false }],
  '9-10': [{ title: 'جشن مهرگان خرد', type: 'ancient', isHoliday: false }],
  '9-13': [{ title: 'جشن سیزده‌به‌در', type: 'ancient', isHoliday: false }],
  '9-15': [{ title: 'جشن شهریورگان', type: 'ancient', isHoliday: false }],
  '9-30': [{ title: 'جشن نوروز روستایی', type: 'ancient', isHoliday: false }],
  
  '10-1': [{ title: 'جشن آب‌ریزان', type: 'ancient', isHoliday: false }],
  '10-5': [{ title: 'جشن خاج‌گیری', type: 'ancient', isHoliday: false }],
  '10-10': [{ title: 'جشن سده', type: 'ancient', isHoliday: false }],
  '10-15': [{ title: 'جشن میانهٔ زمستان', type: 'ancient', isHoliday: false }],
  '10-20': [{ title: 'بازگشت امام خمینی به ایران', type: 'official', isHoliday: false }],
  '10-22': [{ title: 'پیروزی انقلاب اسلامی', type: 'official', isHoliday: true }],
  
  '11-5': [{ title: 'جشن اسفندگان', type: 'ancient', isHoliday: false }],
  '11-14': [{ title: 'جشن واژگونی', type: 'ancient', isHoliday: false }],
  '11-19': [{ title: 'جشن نوروز دروازه‌بان', type: 'ancient', isHoliday: false }],
  '11-29': [{ title: 'روز ملی شدن صنعت نفت', type: 'official', isHoliday: true }],
  
  '12-15': [{ title: 'جشن چهارشنبه‌سوری', type: 'ancient', isHoliday: false }],
  '12-20': [{ title: 'جشن نوروز/جهت‌یابی', type: 'ancient', isHoliday: false }],
  '12-25': [{ title: 'جشن نوروز/خانه‌تکانی', type: 'ancient', isHoliday: false }],
  '12-29': [{ title: 'روز جهانی زمین (ایرانی)', type: 'ancient', isHoliday: false }],
  '12-30': [{ title: 'جشن نوروز/آتش‌افروزی', type: 'ancient', isHoliday: false }],
};

// Islamic lunar holidays (approximate for 1403-1404)
// In production, these should be calculated dynamically
const lunarHolidays: Record<string, string> = {
  '1-9': 'تاسوعای حسینی',
  '1-10': 'عاشورای حسینی',
  '2-20': 'اربعین حسینی',
  '2-28': 'رحلت پیامبر اسلام و شهادت امام حسن مجتبی',
  '2-30': 'شهادت امام رضا',
  '3-8': 'شهادت امام حسن عسکری',
  '3-17': 'میلد پیامبر اسلام و امام صادق',
  '6-3': 'شهادت حضرت فاطمه زهرا',
  '7-13': 'ولادت امام علی',
  '7-27': 'مبعث پیامبر اسلام',
  '8-15': 'ولادت حضرت قائم',
  '9-21': 'شهادت حضرت علی',
  '10-1': 'عید فطر',
  '10-2': 'تعطیل به مناسبت عید فطر',
  '11-11': 'ولادت حضرت علی',
  '12-10': 'عید قربان',
  '12-18': 'عید غدیر خم',
};

export function getHolidays(jDate: JalaliDate): HolidayInfo[] {
  const key = `${jDate.month}-${jDate.day}`;
  const dayHolidays = holidays[key] || [];
  
  // Add lunar holiday if exists (simplified)
  // In real app, use precise lunar calculation
  const lunar = lunarHolidays[key];
  if (lunar) {
    dayHolidays.push({ title: lunar, type: 'religious', isHoliday: true });
  }
  
  return dayHolidays;
}

export function isHoliday(jDate: JalaliDate): boolean {
  return getHolidays(jDate).some(h => h.isHoliday);
}

export function getHolidayTitle(jDate: JalaliDate): string | undefined {
  const hs = getHolidays(jDate);
  return hs.length > 0 ? hs.map(h => h.title).join(' / ') : undefined;
}
