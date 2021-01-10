import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import store from './redux';

import AppNavigator from './navigation/AppNavigator';

export default function App(props) {
  let [fontsLoaded] = useFonts({
    ...Ionicons.font,
    'passion-one-regular': require('./assets/fonts/PassionOne-Regular.otf'),
  });

  if (!fontsLoaded && !props.skipLoadingScreen) {
    return (
      <AppLoading />
    );
  } else {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
