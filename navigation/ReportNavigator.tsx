import React from 'react';
import { View, ViewStyle } from 'react-native';
import { MaterialIcons, Entypo, AntDesign } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
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

const Tab = createMaterialTopTabNavigator<ReportTabParamList>();

export type ReportTabParamList = {
  Photo: undefined;
  Location: undefined;
  Details: {
    details: any;
    updateDetails: any;
    resetReport: any;
    isLoading: boolean;
    county: string;
  };
  Send: undefined;
};

function ReportNavigator() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      // swipeEnabled={false}
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

export type ReportTabScreenProps<T extends keyof ReportTabParamList> =
  NativeStackScreenProps<ReportTabParamList, T>;

const Stack = createNativeStackNavigator();

export type ReportStackParamList = {
  Report: undefined;
  ReportTypeGroups: {
    issueGroups: Array<{
      name: string;
      types: Array<string>;
      iconName: string;
      authority: {
        authCode: string;
        name: string;
        type: string;
      };
    }>;
  };
  ReportTypes: {
    types: Array<string>;
    iconName: string;
    authority: {
      authCode: string;
      name: string;
      type: string;
    };
  };
};

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

export default MainReportNavigator;

export type ReportStackScreenProps<T extends keyof ReportStackParamList> =
  NativeStackScreenProps<ReportStackParamList, T>;
