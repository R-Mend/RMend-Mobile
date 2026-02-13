import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ReportInfoScreen from '../screens/HomeScreens/ReportInfoScreen';
import LoadingScreen from '../screens/LoadingScreen';
import MainHomeNavigator from './HomeNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="SignIn" component={AuthNavigator} />
      <Stack.Screen name="Home" component={MainHomeNavigator} />
      <Stack.Screen name="ReportInfo" component={ReportInfoScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
