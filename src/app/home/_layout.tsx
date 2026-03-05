import { Stack } from 'expo-router';


export default function HomeStackLayout() {
  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="report" />
      {/* <Stack.Screen name="reportinfo" /> */}
    </Stack>
  );
}
