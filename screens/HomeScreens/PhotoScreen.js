import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { firebaseApp } from '../../config/FirebaseApp';

export default class PhotoScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerText}>RMend</Text>
        </View>
        <View style={styles.content}>
          <Image
            source={require('../../assets/images/group_of_field_workers.png')}
            style={styles.image}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (firebaseApp.auth().currentUser != null) {
                navigate('Report');
              } else {
                Alert.alert('You need to be signed in to report issues', '', [{ text: 'Okay' }]);
              }
            }}
          >
            <Text style={{ fontSize: wp('6%'), color: 'white', fontWeight: 'bold' }}>
              Take Photo
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
    alignItems: 'center',
    backgroundColor: 'black',
  },
  headerWrapper: {
    width: wp('100%'),
    height: hp('12%'),
    justifyContent: 'flex-end',
    backgroundColor: 'black',
    padding: wp('1%'),
  },
  headerText: {
    color: 'white',
    fontSize: wp('10%'),
    fontWeight: 'bold',
  },
  content: {
    marginTop: hp('5%'),
    alignItems: 'center',
  },
  image: {
    width: wp('90%'),
    height: hp('50%'),
    borderRadius: wp('10%'),
  },
  button: {
    width: wp('90%'),
    height: hp('7%'),
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('10%'),
    backgroundColor: '#ff6a30',
  },
});
