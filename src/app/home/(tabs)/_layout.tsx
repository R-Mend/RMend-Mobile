import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Entypo, AntDesign } from '@expo/vector-icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { firebaseApp } from '@/config/FirebaseApp';


export default function HomeLayout() {
  return (
    <Tabs
      initialRouteName="photo"
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
      <Tabs.Screen
        name="nearby"
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
              <AntDesign name="file-text" size={wp('6%')} color={focused ? '#FFF' : '#666'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="photo"
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
      <Tabs.Screen
        name="profile"
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
              <AntDesign name="smile" size={wp('6%')} color={focused ? '#FFF' : '#666'} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            if (firebaseApp.auth().currentUser === null) {
              // e.preventDefault();
              navigation.navigate('signin');
            }
          },
        })}
      />
    </Tabs>
  );
}
;