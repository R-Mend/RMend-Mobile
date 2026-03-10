import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';

/**
 * Root route ("/"). Gate for initial load: shows loading while auth resolves,
 * then redirects to home or sign-in based on auth state.
 */
export default function Index() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Redirect href={user ? '/home/(tabs)/photo' : '/auth/signin'} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
