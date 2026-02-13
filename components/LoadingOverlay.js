import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function LoadingOverlay() {
  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    width: wp('100%'),
    height: hp('100%'),
    justifyContent: 'center',
    backgroundColor: 'black',
    alignItems: 'center',
    opacity: 0.5,
    position: 'absolute',
    zIndex: 10000,
  },
});
