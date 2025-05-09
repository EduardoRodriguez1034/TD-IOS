import * as Notifications from 'expo-notifications';

export async function scheduleDailyReminder(count: number) {
    // Cancela notificaciones previas
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Citas para mañana 🗓️",
            body: `Tienes ${count} cita${count === 1 ? '' : 's'} para mañana.`,
            data: { screen: 'HomeScreen' },
        },
        trigger: {
            hour: 17,
            minute: 0,
            repeats: true,
            type: 'daily',
        } as Notifications.DailyTriggerInput,
    });
}