import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Colors from '@/styles/constants/Colors';


interface IHeaderProps {
  title: string;
  navTitleOne: string;
  navTitleTwo: string;
  navActionOne: () => void;
  navActionTwo: () => void;
}

export default function Header(props: IHeaderProps) {
  const { title, navTitleOne, navTitleTwo, navActionOne, navActionTwo } = props;
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton} onPress={navActionOne}>
        <Text style={styles.headerButtonText}>{navTitleOne}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.headerButton} onPress={navActionTwo}>
        <Text style={styles.headerButtonText}>{navTitleTwo}</Text>
      </TouchableOpacity>
    </View>
  );
  
}

const styles = StyleSheet.create({
  header: {
    width: wp('100%'),
    height: hp('10%'),
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    width: wp('40%'),
    fontSize: wp('5%'),
    color: '#EEE',
    textAlign: 'center',
  },
  headerButton: {
    width: wp('15%'),
  },
  headerButtonText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    color: Colors.mainText,
  },
});
