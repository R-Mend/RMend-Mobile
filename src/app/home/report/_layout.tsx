import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialIcons, Entypo, AntDesign } from '@expo/vector-icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';


export default function ReportLayout() {
  return (
    <Tabs
      initialRouteName="photo"
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0.3,
          height: hp('10%'),
          backgroundColor: '#111',
          zIndex: 1000
        },
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="photo"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabBarIcon(focused)}>
              <Entypo name="camera" size={wp('5%')} color={focused ? '#FFF' : '#777'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabBarIcon(focused)}>
              <MaterialIcons name="location-on" size={wp('5%')} color={focused ? '#FFF' : '#666'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabBarIcon(focused)}>
              <AntDesign name="profile" size={wp('5%')} color={focused ? '#FFF' : '#666'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabBarIcon(focused)}>
              <MaterialIcons name="send" size={wp('5%')} color={focused ? '#FFF' : '#666'} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const tabBarIcon = (focused: boolean): ViewStyle => {
  return {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: focused ? '#33C7FF' : '#FFE633'
  };
};
