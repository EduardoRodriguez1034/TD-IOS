import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
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

    // Escuchar cuando la app está en foreground
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('📩 Notificación en primer plano:', remoteMessage);
    });

    // Escuchar cuando la app se abre desde una notificación (background)
    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      const data = remoteMessage?.data;
      console.log('🔁 App abierta desde background:', data);
      if (data?.idAppointment) {
        router.push(`/appointments`);
      }
    });

    // Escuchar cuando la app se abre desde cerrada (killed)
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
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="/index.tsx" />
        </>
      ) : (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(patient)" />
        </>
      )}
    </Stack>
  );
}
