import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { firebaseApp } from '@/config/FirebaseApp';
import { RootStackScreenProps } from '@/navigation/AppNavigator';

export default class Loading extends React.Component<RootStackScreenProps<'Loading'>> {
  componentDidMount() {
    const listener = firebaseApp.auth().onAuthStateChanged((user) => {
      listener();
      if (user) {
        this.props.navigation.navigate('Home');
      } else {
        // Only used for stack navigaton when authentication is promted from profile screen
        // this.props.navigation.navigate('Auth');
        this.props.navigation.navigate('SignIn');
      }
    });
  }

  render() {
    return <View style={styles.container}></View>;
  }
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
