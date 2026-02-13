import React from 'react';
import { View } from 'react-native';
import { MaterialIcons, Entypo, AntDesign } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import ReportPhotoScreen from '../screens/ReportScreens/ReportPhotoScreen';
import ReportLocationScreen from '../screens/ReportScreens/ReportLocationScreen';
import ReportDetailsScreen from '../screens/ReportScreens/ReportDetailsScreen';
import ReportSendScreen from '../screens/ReportScreens/ReportSendScreen';
import ReportTypesScreen from '../screens/ReportScreens/ReportTypesScreen';
import ReportTypeGroupsScreen from '../screens/ReportScreens/ReportTypeGroupsScreen';

const Tab = createMaterialTopTabNavigator();

function ReportNavigator() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      swipeEnabled={false}
      screenOptions={{
        tabBarIndicatorStyle: {
          display: 'none'
        },
        tabBarStyle: {
          borderTopWidth: 0.3,
          height: hp('10%'),
          backgroundColor: '#111',
          zIndex: 1000
        },
      }}
    >
      <Tab.Screen
        name="Photo"
        component={ReportPhotoScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={tabBarIcon(focused)}>
              <Entypo name="camera" size={wp('5%')} color={focused ? '#FFF' : '#777'} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Location"
        component={ReportLocationScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={tabBarIcon(focused)}>
              <MaterialIcons name="location-on" size={wp('5%')} color={focused ? '#FFF' : '#666'} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Details"
        component={ReportDetailsScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={tabBarIcon(focused)}>
              <AntDesign name="profile" size={wp('5%')} color={focused ? '#FFF' : '#666'} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Send"
        component={ReportSendScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={tabBarIcon(focused)}>
              <MaterialIcons name="send" size={wp('5%')} color={focused ? '#FFF' : '#666'} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function MainReportNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Report"
      screenOptions={{
        headerStyle: {
          backgroundColor: 'black'
        },
        headerTintColor: '#ff6a30'
      }}
    >
      <Stack.Screen
        name="Report"
        component={ReportNavigator}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ReportTypeGroups"
        component={ReportTypeGroupsScreen}
        options={{
          headerShown: true
        }}
      />
      <Stack.Screen
        name="ReportTypes"
        component={ReportTypesScreen}
        options={{
          headerShown: true,
          headerTitle: 'Types'
        }}
      />
    </Stack.Navigator>
  );
}

const tabBarIcon = focused => {
  return {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: focused ? '#33C7FF' : '#FFE633'
  };
};

export default MainReportNavigator;
