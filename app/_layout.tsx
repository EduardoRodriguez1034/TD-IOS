import { Stack, Slot } from 'expo-router';
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { requestFirebaseNotificationPermission } from './utils/notifications';
import { useAuthStore } from './store/authStore';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const { checkAuth } = useAuthStore();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?.idUser) {
      requestFirebaseNotificationPermission(user.idUser);
    }

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('📩 Notificación en primer plano:', remoteMessage);
    });

    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      const data = remoteMessage?.data;
      console.log('🔁 App abierta desde background:', data);
      if (data?.idAppointment) {
        router.push(`/appointments`);
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const data = remoteMessage?.data;
          console.log('🕹️ App abierta desde notificación (cerrada):', data);
          if (data?.idAppointment) {
            router.push(`/appointment/${data.idAppointment}`);
          }
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, [user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Slot />
    </Stack>
  );
}

export const linking = {
  prefixes: ['truvaldental://'],
  config: {
    screens: {
      '(auth)': {
        screens: {
          'index': '',
          'new-password/[token]': 'new-password/:token'
        }
      },
      '(tabs)': {
        screens: {
          'index': 'home'
        }
      }
    }
  }
};
