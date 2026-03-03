import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export interface IInfoMessageProps {
  message: string;
}

export default function InfoMessage(props: IInfoMessageProps) {
  return (
    <View style={styles.infoMessage}>
      <Text style={styles.text}>{props.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoMessage: {
    width: Dimensions.get('window').width,
    height: hp('5%'),
    backgroundColor: '#545454',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: wp('3%'),
    color: '#EEE',
  },
});
