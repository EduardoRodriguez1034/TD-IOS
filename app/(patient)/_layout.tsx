import { Stack } from 'expo-router';

export default function PatientLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerBackTitle: 'Volver',
                headerTintColor: 'black',
                headerStyle: {
                    backgroundColor: 'white',
                },
                headerShadowVisible: false,
            }}
        />
    );
}
