import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Platform } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import Toggle from '@/components/Toggle';
import { useAppStore } from '@/store/appStore';
import { toPersianNumber } from '@/utils/persianDate';

export default function SettingsScreen({ navigation }: any) {
  const { theme, toggleTheme } = useTheme();
  const { 
    profile, 
    compactNotes, 
    showOnLockScreen, 
    hapticEnabled, 
    cloudSyncEnabled,
    aiAssistantEnabled,
    stats,
    setCompactNotes,
    setShowOnLockScreen,
    setHapticEnabled,
    setCloudSyncEnabled,
    setAiAssistantEnabled,
  } = useAppStore();

  const handleShareSupport = async () => {
    try {
      await Share.share({
        message: `Roozegar Pro Support Info:\nVersion: 1.0.0\nUser: ${profile.name}\nPlatform: ${Platform.OS}`,
      });
    } catch {}
  };

  const SectionTitle = ({ title }: { title: string }) => (
    <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>{title}</Text>
  );

  const Row = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    toggle, 
    toggleValue, 
    onToggle,
    showArrow = true 
  }: any) => (
    <TouchableOpacity 
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={[styles.row, { borderBottomColor: theme.border }]}
    >
      <View style={styles.rowLeft}>
        {toggle ? (
          <Toggle value={toggleValue} onValueChange={onToggle} />
        ) : showArrow ? (
          <Text style={[styles.arrow, { color: theme.textTertiary }]}>›</Text>
        ) : null}
      </View>
      <View style={styles.rowCenter}>
        <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
      </View>
      <View style={styles.rowRight}>
        <View style={[styles.iconBox, { backgroundColor: theme.surfaceHighlight }]}>
          <Text style={{ fontSize: 18 }}>{icon}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>تنظیمات</Text>
        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.surface }]}>
          <Text style={{ color: theme.text, fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textTertiary }]}>تعداد کاراکتر</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{toPersianNumber(stats.totalChars)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textTertiary }]}>صفحات</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{toPersianNumber(stats.pages)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textTertiary }]}>روزهای استفاده</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{toPersianNumber(stats.usageDays)}</Text>
          <Text style={[styles.statDate, { color: theme.textSecondary }]}>{stats.startDate}</Text>
        </View>
      </View>

      {/* Customize Section */}
      <SectionTitle title="شخصی‌سازی" />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Row 
          icon="🎨"
          title="تغییر آیکون اپ"
          onPress={() => navigation?.navigate('AppIconPicker')}
        />
        <Row 
          icon="↕️"
          title="یادداشت‌های فشرده"
          toggle
          toggleValue={compactNotes}
          onToggle={setCompactNotes}
          showArrow={false}
        />
        <Row 
          icon="📝"
          title="قالب یادداشت"
          subtitle="مناسب برای لیست کارهای روزانه"
          onPress={() => navigation?.navigate('NoteDesigns')}
        />
        <Row 
          icon="🔒"
          title="نمایش روی لاک اسکرین"
          subtitle="وقتی روشن است، یادداشت شما حتی پس از حذف از لاک اسکرین، ظرف ۸ ساعت دوباره ظاهر می‌شود."
          toggle
          toggleValue={showOnLockScreen}
          onToggle={setShowOnLockScreen}
          showArrow={false}
        />
      </View>

      {/* AI & Advanced */}
      <SectionTitle title="هوش مصنوعی و پیشرفته" />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Row 
          icon="🤖"
          title="دستیار هوشمند"
          subtitle="ثبت رویداد با صوت یا متن روان"
          toggle
          toggleValue={aiAssistantEnabled}
          onToggle={setAiAssistantEnabled}
          showArrow={false}
        />
        <Row 
          icon="☁️"
          title="همگام‌سازی ابری"
          subtitle="پشتیبان‌گیری رمزنگاری‌شده"
          toggle
          toggleValue={cloudSyncEnabled}
          onToggle={setCloudSyncEnabled}
          showArrow={false}
        />
        <Row 
          icon="🔔"
          title="لرزش (Haptic)"
          toggle
          toggleValue={hapticEnabled}
          onToggle={setHapticEnabled}
          showArrow={false}
        />
      </View>

      {/* Appearance */}
      <SectionTitle title="ظاهر" />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Row 
          icon="🌙"
          title="حالت تاریک"
          onPress={toggleTheme}
          subtitle={theme.isDark ? 'فعال' : 'غیرفعال'}
        />
        <Row 
          icon="🎨"
          title="رنگ تم"
          subtitle="تغییر رنگ اصلی اپلیکیشن"
          onPress={() => navigation?.navigate('AccentColorPicker')}
        />
      </View>

      {/* Help */}
      <SectionTitle title="راهنما" />
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Row icon="🔄" title="مشاهده آموزش دوباره" onPress={() => {}} />
        <Row icon="❓" title="سوالات متداول" onPress={() => {}} />
        <Row icon="📋" title="کپی اطلاعات پشتیبانی" onPress={handleShareSupport} showArrow={false} />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    flex: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  statDate: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(128,128,128,0.2)',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    minHeight: 56,
  },
  rowLeft: {
    width: 50,
    alignItems: 'flex-end',
  },
  rowCenter: {
    flex: 1,
    alignItems: 'flex-end',
    marginHorizontal: 12,
  },
  rowRight: {
    width: 36,
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    fontWeight: '300',
  },
});
