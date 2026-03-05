import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { firebaseApp } from '@/config/FirebaseApp';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const listener = firebaseApp.auth().onAuthStateChanged((user) => {
      listener();
      if (user) {
        // Navigate to Home if user is authenticated
        router.replace('/home/(tabs)/photo');
      } else {
        // Navigate to SignIn if user is not authenticated
        router.replace('/auth/signin');
      }
    });
  }, []);

  return <View style={styles.container}></View>;
}
const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  image: {
    flex: 1,
  },
});
