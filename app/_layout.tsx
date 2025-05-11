import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { theme } from './constants/theme';
import { useFonts } from 'expo-font'
import { MaterialCommunityIcons } from '@expo/vector-icons'
//import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useAuthStore } from './store/authStore';

/*Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});*/

export default function RootLayout() {
  const router = useRouter();
  const { checkAuth, isCheckingAuth } = useAuthStore()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  // Al montar, comprobamos la cookie/token
  useEffect(() => { checkAuth() }, [checkAuth])
  const [fontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
  })

  if (!fontsLoaded) {
    return null;
  }

  /*useEffect(() => {

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data.screen;
      if (screen === 'HomeScreen') {
        router.push('/');
      }
    });
    return () => subscription.remove();
  }, [])*/
  if (isCheckingAuth) {
    return <ActivityIndicator style={{ flex:1, justifyContent:'center' }} />
  }

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="(auth)"/>
            <Stack.Screen name="/index.tsx"/>
          </>
        ) : (
          <>
            <Stack.Screen name="(tabs)"/>
            <Stack.Screen name="(patient)"/>
          </>
        )}
      </Stack>
    </PaperProvider>
  )
}