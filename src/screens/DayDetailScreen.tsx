import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeContext';
import DrawingCanvas from '@/components/DrawingCanvas';
import { JalaliDate, CheckItem, CalendarEvent, ReminderConfig } from '@/types';
import { formatJalaliFull, toPersianNumber } from '@/utils/persianDate';
import { getHolidayTitle } from '@/utils/holidays';

const { width } = Dimensions.get('window');

interface DayDetailScreenProps {
  route: { params: { jDate: JalaliDate } };
  navigation: any;
}

export default function DayDetailScreen({ route, navigation }: DayDetailScreenProps) {
  const { jDate } = route.params;
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'note' | 'events' | 'draw'>('note');
  const [noteText, setNoteText] = useState('');
  const [checkboxes, setCheckboxes] = useState<CheckItem[]>([
    { id: '1', text: 'خرید شیر', checked: false },
  ]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [drawingPaths, setDrawingPaths] = useState<any[]>([]);

  const holidayName = getHolidayTitle(jDate);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `روزگار پرو - ${formatJalaliFull(jDate)}\n${noteText || 'یادداشتی ثبت نشده'}`,
      });
    } catch {}
  };

  const toggleCheckbox = useCallback((id: string) => {
    setCheckboxes(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  }, []);

  const addCheckbox = useCallback(() => {
    setCheckboxes(prev => [...prev, { id: Date.now().toString(), text: '', checked: false }]);
  }, []);

  const updateCheckboxText = useCallback((id: string, text: string) => {
    setCheckboxes(prev => prev.map(c => c.id === id ? { ...c, text } : c));
  }, []);

  const addEvent = useCallback(() => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: 'رویداد جدید',
      category: 'personal',
      color: theme.primary,
      jDate,
      gDate: new Date(),
      reminders: [],
      isRecurring: false,
      attachments: [],
      isShared: false,
      isPrivate: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setEvents(prev => [...prev, newEvent]);
  }, [jDate, theme.primary]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: theme.text }]}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerDate, { color: theme.text }]}>{formatJalaliFull(jDate)}</Text>
          {holidayName && (
            <Text style={[styles.holidayName, { color: theme.danger }]}>{holidayName}</Text>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.shareBtn, { backgroundColor: theme.primary }]} 
          onPress={handleShare}
        >
          <Text style={styles.shareText}>↗</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface }]}>
        {(['note', 'events', 'draw'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && [styles.activeTab, { backgroundColor: theme.primary }],
            ]}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === tab ? '#000' : theme.textSecondary },
              activeTab === tab && { fontWeight: '700' },
            ]}>
              {tab === 'note' ? 'یادداشت' : tab === 'events' ? 'رویدادها' : 'طراحی'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'note' && (
          <View>
            {/* Text Note */}
            <View style={[styles.noteCard, { backgroundColor: theme.surface }]}>
              <TextInput
                style={[styles.noteInput, { color: theme.text }]}
                multiline
                placeholder="یادداشت امروز..."
                placeholderTextColor={theme.textTertiary}
                value={noteText}
                onChangeText={setNoteText}
                textAlign="right"
                textAlignVertical="top"
              />
            </View>

            {/* Checkboxes */}
            <View style={[styles.checkCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.checkTitle, { color: theme.text }]}>چک‌لیست</Text>
              {checkboxes.map(item => (
                <View key={item.id} style={styles.checkRow}>
                  <TouchableOpacity 
                    onPress={() => toggleCheckbox(item.id)}
                    style={[
                      styles.checkBox,
                      { borderColor: theme.primary },
                      item.checked && { backgroundColor: theme.primary }
                    ]}
                  >
                    {item.checked && <Text style={styles.checkMark}>✓</Text>}
                  </TouchableOpacity>
                  <TextInput
                    style={[
                      styles.checkInput,
                      { color: theme.text },
                      item.checked && { textDecorationLine: 'line-through', opacity: 0.5 }
                    ]}
                    value={item.text}
                    onChangeText={(t) => updateCheckboxText(item.id, t)}
                    placeholder="آیتم جدید..."
                    placeholderTextColor={theme.textTertiary}
                    textAlign="right"
                  />
                </View>
              ))}
              <TouchableOpacity onPress={addCheckbox} style={styles.addCheckBtn}>
                <Text style={[styles.addCheckText, { color: theme.primary }]}>+ افزودن آیتم</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'events' && (
          <View>
            <TouchableOpacity 
              onPress={addEvent}
              style={[styles.addEventBtn, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.addEventText}>+ رویداد جدید</Text>
            </TouchableOpacity>
            
            {events.length === 0 && (
              <View style={[styles.emptyCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>بدون رویداد</Text>
                <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                  برای این روز هیچ رویدادی ثبت نشده.
                </Text>
              </View>
            )}
            
            {events.map(event => (
              <View key={event.id} style={[styles.eventCard, { backgroundColor: theme.surface }]}>
                <View style={styles.eventHeader}>
                  <View style={[styles.eventColor, { backgroundColor: event.color }]} />
                  <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
                </View>
                <View style={styles.eventMeta}>
                  <Text style={[styles.eventMetaText, { color: theme.textSecondary }]}>
                    ⏰ {toPersianNumber(8)}:{toPersianNumber(0)} صبح
                  </Text>
                  <Text style={[styles.eventMetaText, { color: theme.textSecondary }]}>
                    📍 تهران
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'draw' && (
          <View style={styles.drawSection}>
            <Text style={[styles.drawHint, { color: theme.textSecondary }]}>
              با انگشت یا قلم اپل پنسل بنویسید
            </Text>
            <DrawingCanvas
              width={width - 32}
              height={400}
              paths={drawingPaths}
              onPathsChange={setDrawingPaths}
              strokeColor={theme.isDark ? '#fff' : '#1a1a1a'}
              backgroundColor={theme.isDark ? '#1f1f1f' : '#F5F0D0'}
            />
            <View style={styles.drawTools}>
              {['#1a1a1a', '#E85D5D', '#5A8AE8', '#22c55e', '#E8924A'].map(color => (
                <TouchableOpacity 
                  key={color} 
                  style={[styles.colorBtn, { backgroundColor: color }]} 
                />
              ))}
              <TouchableOpacity style={[styles.colorBtn, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}>
                <Text>↺</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerDate: {
    fontSize: 17,
    fontWeight: '700',
  },
  holidayName: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareText: {
    fontSize: 16,
    color: '#000',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  noteCard: {
    borderRadius: 24,
    padding: 16,
    minHeight: 150,
    marginBottom: 16,
  },
  noteInput: {
    fontSize: 16,
    lineHeight: 26,
    minHeight: 120,
    textAlign: 'right',
  },
  checkCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  checkTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
  },
  checkInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
  },
  addCheckBtn: {
    marginTop: 8,
    paddingVertical: 8,
  },
  addCheckText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  addEventBtn: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addEventText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  emptyCard: {
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
  },
  eventCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  eventColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  eventMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  eventMetaText: {
    fontSize: 13,
  },
  drawSection: {
    alignItems: 'center',
  },
  drawHint: {
    fontSize: 13,
    marginBottom: 12,
  },
  drawTools: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  colorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
