import { initializeApp, getApps } from 'firebase/app';
import Constants from 'expo-constants';

const firebaseConfig = Constants.expoConfig?.extra?.firebase;

if (!firebaseConfig) {
    throw new Error('❌ Firebase config no encontrada en extra.firebase');
}

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { firebaseApp };