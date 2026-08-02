import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { JalaliDate, CalendarDay, CalendarEvent } from '@/types';
import { 
  getJalaliMonthGrid, 
  getPersianMonthName, 
  toPersianNumber, 
  getTodayJalali,
  jalaliToGregorian,
} from '@/utils/persianDate';
import { getHolidays, isHoliday } from '@/utils/holidays';
import { useTheme } from '@/theme/ThemeContext';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 48) / 7;

interface PersianCalendarProps {
  year: number;
  month: number;
  selectedDate?: JalaliDate;
  events?: Record<string, CalendarEvent[]>;
  onSelectDate: (jDate: JalaliDate) => void;
  onChangeMonth: (year: number, month: number) => void;
}

export default function PersianCalendar({ 
  year, month, selectedDate, events, onSelectDate, onChangeMonth 
}: PersianCalendarProps) {
  const { theme } = useTheme();
  const today = getTodayJalali();
  const grid = getJalaliMonthGrid(year, month);
  
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  
  const handlePrevMonth = () => {
    if (month === 1) onChangeMonth(year - 1, 12);
    else onChangeMonth(year, month - 1);
  };
  
  const handleNextMonth = () => {
    if (month === 12) onChangeMonth(year + 1, 1);
    else onChangeMonth(year, month + 1);
  };

  const getDayEvents = (jDate: JalaliDate): CalendarEvent[] => {
    const key = `${jDate.year}-${jDate.month}-${jDate.day}`;
    return events?.[key] || [];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn}>
          <Text style={[styles.arrow, { color: theme.text }]}>›</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.monthTitle, { color: theme.text }]}>
            {getPersianMonthName(month)} {toPersianNumber(year)}
          </Text>
          {today.year === year && today.month === month && (
            <View style={[styles.todayBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.todayBadgeText}>امروز</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowBtn}>
          <Text style={[styles.arrow, { color: theme.text }]}>‹</Text>
        </TouchableOpacity>
      </View>

      {/* Weekday headers */}
      <View style={styles.weekDaysRow}>
        {weekDays.map((day, idx) => (
          <View key={idx} style={styles.cell}>
            <Text style={[
              styles.weekDayText, 
              { color: idx === 6 ? theme.danger : theme.textSecondary }
            ]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {grid.map((item, idx) => {
          const isToday = item.isCurrentMonth && 
            item.jDate.day === today.day && 
            item.jDate.month === today.month && 
            item.jDate.year === today.year;
          const isSelected = selectedDate && 
            item.jDate.day === selectedDate.day && 
            item.jDate.month === selectedDate.month && 
            item.jDate.year === selectedDate.year;
          const dayHoliday = isHoliday(item.jDate);
          const dayEvents = getDayEvents(item.jDate);
          
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => onSelectDate(item.jDate)}
              style={[
                styles.cell,
                styles.dayCell,
                isToday && [styles.todayCell, { borderColor: theme.primary }],
                isSelected && [styles.selectedCell, { backgroundColor: theme.primary }],
                !item.isCurrentMonth && styles.dimmedCell,
              ]}
            >
              <Text style={[
                styles.dayText,
                { color: theme.text },
                dayHoliday && { color: theme.danger, fontWeight: '700' },
                isSelected && { color: '#fff' },
                !item.isCurrentMonth && { color: theme.textTertiary },
              ]}>
                {toPersianNumber(item.jDate.day)}
              </Text>
              
              {/* Event dots */}
              {dayEvents.length > 0 && (
                <View style={styles.dotsRow}>
                  {dayEvents.slice(0, 3).map((evt, i) => (
                    <View 
                      key={i} 
                      style={[styles.dot, { backgroundColor: evt.color || theme.primary }]} 
                    />
                  ))}
                </View>
              )}
              
              {/* Holiday indicator */}
              {dayHoliday && !isSelected && (
                <View style={[styles.holidayStrip, { backgroundColor: theme.danger }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  arrowBtn: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },
  titleContainer: {
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  todayBadge: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  todayBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '700',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCell: {
    borderRadius: 12,
    marginBottom: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  todayCell: {
    borderWidth: 2,
  },
  selectedCell: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dimmedCell: {
    opacity: 0.4,
  },
  dotsRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 6,
    gap: 3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  holidayStrip: {
    position: 'absolute',
    top: 4,
    width: 16,
    height: 3,
    borderRadius: 2,
  },
});
