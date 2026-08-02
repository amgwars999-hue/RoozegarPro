import * as Notifications from 'expo-notifications';
import { CalendarEvent, ReminderConfig, JalaliDate } from '@/types';
import { jalaliToGregorian } from './persianDate';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function scheduleEventReminders(event: CalendarEvent): Promise<string[]> {
  const identifiers: string[] = [];
  
  for (const reminder of event.reminders) {
    if (!reminder.isEnabled) continue;
    
    const triggerDate = calculateTriggerDate(event, reminder);
    if (!triggerDate || triggerDate <= new Date()) continue;
    
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: event.title,
        body: reminder.customMessage || `یادآوری: ${event.title}`,
        data: { eventId: event.id, type: reminder.type },
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        date: triggerDate,
      } as any,
    });
    
    identifiers.push(identifier);
  }
  
  return identifiers;
}

export async function scheduleLockScreenNote(noteText: string, jDate: JalaliDate): Promise<string> {
  const gDate = jalaliToGregorian(jDate.year, jDate.month, jDate.day);
  gDate.setHours(7, 0, 0, 0);
  
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: 'یادداشت امروز',
      body: noteText.substring(0, 100),
      data: { type: 'lockscreen-note' },
      sticky: true,
    },
    trigger: {
      date: gDate,
      repeats: true,
    } as any,
  });
}

function calculateTriggerDate(event: CalendarEvent, reminder: ReminderConfig): Date | null {
  const gDate = jalaliToGregorian(event.jDate.year, event.jDate.month, event.jDate.day);
  
  if (event.startTime) {
    const [hours, minutes] = event.startTime.split(':').map(Number);
    gDate.setHours(hours, minutes, 0, 0);
  } else {
    gDate.setHours(9, 0, 0, 0);
  }
  
  gDate.setMinutes(gDate.getMinutes() - reminder.minutesBefore);
  return gDate;
}

export async function cancelAllRemindersForEvent(eventId: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = scheduled.filter(n => n.content.data?.eventId === eventId);
  for (const n of toCancel) {
    await Notifications.cancelScheduledNotificationAsync(n.identifier);
  }
}

export async function getScheduledRemindersCount(): Promise<number> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.length;
}
