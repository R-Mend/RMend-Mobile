import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';

import store from '@/redux';

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

export default function RootLayout(props) {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    'passion-one-regular': require('../assets/fonts/PassionOne-Regular.otf'),
  });

  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded || props.skipLoadingScreen) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplash();
  }, [fontsLoaded]);

  if (!fontsLoaded && !props.skipLoadingScreen) {
    return null;
  }

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="home" />
        <Stack.Screen name="reportinfo" />
      </Stack>
    </Provider>
  );
}
