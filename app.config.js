export default ({ config }) => ({
  ...config,
  "expo": {
    "name": "Truval Dental",
    "slug": "truval-dental",
    "scheme": "truvaldental",
    "platforms": ['ios', 'android'],
    "deepLinks": ["truvaldental://*"],
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.truvaldental.app",
      "infoPlist": {
        "NSUserNotificationUsageDescription": "Esta app usa notificaciones para recordarte tus citas.",
        "FirebaseAppDelegateProxyEnabled": false,
        "UIBackgroundModes": [
          "fetch",
          "remote-notification"
        ]
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.truvaldental.app"
    },
    "web": {
      "favicon": "./assets/icon.png"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-notifications"
    ],
    "extra": {
      "router": {},
      "eas": {
        "projectId": "1685a21b-f97e-424e-80c3-1654ca9a4c9f"
      },
      "firebase": {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
      }
    }
  }
});