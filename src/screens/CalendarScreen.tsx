import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PersianCalendar from '@/components/PersianCalendar';
import { useTheme } from '@/theme/ThemeContext';
import { JalaliDate, CalendarEvent } from '@/types';
import { getTodayJalali, toPersianNumber, formatJalaliFull, getPersianMonthName } from '@/utils/persianDate';
import { getHolidayTitle } from '@/utils/holidays';

const { width } = Dimensions.get('window');

// Demo events for visualization
const demoEvents: Record<string, CalendarEvent[]> = {
  '1405-5-10': [
    { 
      id: '1', title: 'نمایشگاه بین‌المللی تهران', category: 'exhibition', 
      color: '#E8924A', jDate: { year: 1405, month: 5, day: 10 }, 
      gDate: new Date(), reminders: [], isRecurring: false, attachments: [], 
      isShared: false, isPrivate: false, createdAt: Date.now(), updatedAt: Date.now() 
    },
  ],
  '1405-5-15': [
    { 
      id: '2', title: 'جلسه کاری با علی', category: 'business-meeting', 
      color: '#5A8AE8', jDate: { year: 1405, month: 5, day: 15 }, 
      gDate: new Date(), reminders: [], isRecurring: false, attachments: [], 
      isShared: true, isPrivate: false, createdAt: Date.now(), updatedAt: Date.now() 
    },
  ],
  '1405-5-20': [
    { 
      id: '3', title: 'تعطیلی رسمی', category: 'official-holiday', 
      color: '#E85D5D', jDate: { year: 1405, month: 5, day: 20 }, 
      gDate: new Date(), reminders: [], isRecurring: false, attachments: [], 
      isShared: false, isPrivate: false, createdAt: Date.now(), updatedAt: Date.now() 
    },
  ],
};

export default function CalendarScreen({ navigation }: any) {
  const { theme } = useTheme();
  const today = getTodayJalali();
  const [currentYear, setCurrentYear] = useState(today.year);
  const [currentMonth, setCurrentMonth] = useState(today.month);
  const [selectedDate, setSelectedDate] = useState<JalaliDate>(today);

  const showComingSoon = () => {
    Alert.alert('به زودی', 'این قابلیت در نسخه بعدی اضافه می‌شود.');
  };

  const handleSelectDate = useCallback((jDate: JalaliDate) => {
    setSelectedDate(jDate);
    navigation.navigate('DayDetail', { jDate });
  }, [navigation]);

  const handleChangeMonth = useCallback((year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  }, []);

  const holidayName = getHolidayTitle(selectedDate);
  const selectedKey = `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`;
  const selectedEvents = demoEvents[selectedKey] || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={[styles.settingsBtn, { backgroundColor: theme.surface }]} 
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.appTitle, { color: theme.text }]}>روزگار پرو</Text>
          <Text style={[styles.dateSubtitle, { color: theme.textSecondary }]}>
            {formatJalaliFull(today)}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: theme.primary }]} 
          onPress={() => navigation.navigate('DayDetail', { jDate: selectedDate })}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <PersianCalendar
          year={currentYear}
          month={currentMonth}
          selectedDate={selectedDate}
          events={demoEvents}
          onSelectDate={handleSelectDate}
          onChangeMonth={handleChangeMonth}
        />

        {/* Selected day summary */}
        <View style={styles.summarySection}>
          <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
            <View style={styles.summaryHeader}>
              <Text style={[styles.summaryDate, { color: theme.text }]}>
                {toPersianNumber(selectedDate.day)} {getPersianMonthName(selectedDate.month)}
              </Text>
              {holidayName && (
                <View style={[styles.holidayBadge, { backgroundColor: theme.danger + '20' }]}>
                  <Text style={[styles.holidayText, { color: theme.danger }]}>{holidayName}</Text>
                </View>
              )}
            </View>

            {selectedEvents.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
                رویدادی ثبت نشده. برای افزودن ضربه بزنید.
              </Text>
            ) : (
              <View style={styles.eventsList}>
                {selectedEvents.map(event => (
                  <TouchableOpacity 
                    key={event.id} 
                    style={[styles.eventRow, { backgroundColor: event.color + '15' }]}
                    onPress={showComingSoon}
                  >
                    <View style={[styles.eventDot, { backgroundColor: event.color }]} />
                    <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
                    <Text style={[styles.eventCategory, { color: theme.textSecondary }]}>
                      {event.category === 'exhibition' ? 'نمایشگاه' : 
                       event.category === 'business-meeting' ? 'جلسه' : 'تعطیلی'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.surface }]} 
            onPress={showComingSoon}
          >
            <Text style={{ fontSize: 24 }}>🎙️</Text>
            <Text style={[styles.actionText, { color: theme.text }]}>صوتی</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.surface }]} 
            onPress={() => navigation.navigate('DayDetail', { jDate: selectedDate })}
          >
            <Text style={{ fontSize: 24 }}>✏️</Text>
            <Text style={[styles.actionText, { color: theme.text }]}>نوشتن</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.surface }]} 
            onPress={showComingSoon}
          >
            <Text style={{ fontSize: 24 }}>📷</Text>
            <Text style={[styles.actionText, { color: theme.text }]}>اسکن</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.surface }]} 
            onPress={showComingSoon}
          >
            <Text style={{ fontSize: 24 }}>🔗</Text>
            <Text style={[styles.actionText, { color: theme.text }]}>اشتراک</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  dateSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#000',
  },
  summarySection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  summaryCard: {
    borderRadius: 24,
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryDate: {
    fontSize: 18,
    fontWeight: '700',
  },
  holidayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  holidayText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
  eventsList: {
    gap: 8,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
  },
  eventDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  eventTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  eventCategory: {
    fontSize: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  actionBtn: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
