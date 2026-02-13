import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../constants/Colors';

export default class AuthScreen extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {/* Only used when authentication is promtend from profile screen not from loading the app */}
        {/* <TouchableOpacity style={styles.close} onPress={() => navigation.navigate('Profile')}>
          <AntDesign name="close" size={wp('10%')} color="white" />
        </TouchableOpacity> */}
        <Text style={styles.header}>R.Mend</Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
            <Text style={{ fontSize: wp('6%'), color: 'white', fontWeight: 'bold' }}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateUser')}>
            <Text style={{ fontSize: wp('6%'), color: 'white', fontWeight: 'bold' }}>
              Registure
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: Colors.mainText,
    textAlign: 'center',
    fontSize: wp('25%'),
    fontFamily: 'passion-one-regular',
    justifyContent: 'center',
  },
  buttons: {
    alignItems: 'center',
  },
  button: {
    width: wp('90%'),
    height: hp('7%'),
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
    backgroundColor: '#ff6a30',
  },
  close: {
    position: 'absolute',
    top: hp('5%'),
    left: wp('2%'),
  },
});
