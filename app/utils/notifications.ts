// utils/notifications.ts
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

export async function requestFirebaseNotificationPermission(idUser: number) {
    try {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 33) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.warn('❌ Permiso de notificaciones denegado');
                    return;
                }
            }
        }

        const authStatus = await messaging().requestPermission({
            alert: true,
            announcement: true,
            badge: true,
            carPlay: true,
            provisional: true,
            sound: true,
        });
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            console.warn('🚫 Permisos de notificación no concedidos');
            return;
        }

        const fcmToken = await messaging().getToken();

        // Enviar al backend
        await fetch('https://truval-dental.ddns.net:8443/fcm-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUser, token: fcmToken }),
        });
    } catch (err) {
        console.error('❌ Error registrando token FCM:', err);
    }
}
