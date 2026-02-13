import React from 'react';
import { View } from 'react-native';
import { Entypo, AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { firebaseApp } from '../config/FirebaseApp';
import NearbyScreen from '../screens/HomeScreens/NearbyScreen';
import PhotoScreen from '../screens/HomeScreens/PhotoScreen';
import ProfileScreen from '../screens/HomeScreens/ProfileScreen';
import ReportInfoScreen from '../screens/HomeScreens/ReportInfoScreen';
import MainReportNavigator from './ReportNavigator';

const Tab = createBottomTabNavigator();

function HomeNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Photo"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0.3,
          height: hp('6%'),
          backgroundColor: '#111',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Nearby"
        component={NearbyScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: wp('10%'),
                height: wp('10%'),
                borderRadius: 42,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AntDesign name="filetext1" size={wp('6%')} color={focused ? '#FFF' : '#666'} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Photo"
        component={PhotoScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: wp('15%'),
                height: wp('15%'),
                borderRadius: wp('8%'),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: focused ? '#ff6a30' : '#111',
              }}
            >
              <Entypo name="camera" size={wp('7%')} color={focused ? '#FFF' : '#666'} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: wp('10%'),
                height: wp('10%'),
                borderRadius: 42,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AntDesign name="smileo" size={wp('6%')} color={focused ? '#FFF' : '#666'} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (firebaseApp.auth().currentUser === null) {
              e.preventDefault();
              navigation.navigate('SignIn');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function MainHomeNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="Home" component={HomeNavigator} />
      <Stack.Screen name="ReportInfo" component={ReportInfoScreen} />
      <Stack.Screen name="Report" component={MainReportNavigator} />
    </Stack.Navigator>
  );
}

export default MainHomeNavigator;
