import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import LoadingOverlay from '@/components/LoadingOverlay';
import { useAuth } from '@/hooks/useAuth';


export default function ProfileScreen() {
  const [displayName, setDisplayName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, signOut, updateProfile } = useAuth();

  useEffect(() => {
    updateProfileFields();
  }, [user]);

  const updateProfileFields = () => {
    setEmail(user.email);
    setDisplayName(user.displayName);
    setPhoneNumber(user.phoneNumber);
  }

  const handleSignInOutPress = () => {
    if (user != null) {
      signOut();
    }
  };

  const updateProfileAlert = () => {
    Alert.alert('Are you sure you want to make these changes?', 'Changes can be made latter.', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => updateProfileFields(),
      },
      { text: 'Ok', onPress: () => updateCloudProfile() },
    ]);
  };

  // TODO: Update this to use Formik validation schema like other screens
  const validate = async () => {
    interface IValidationErrors {
      displayName?: string
      email?: string;
      phone?: string
    }

    const validEmailReg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    let errors: IValidationErrors = {};

    if (!displayName) {
      errors.displayName = 'Name is required';
      Alert.alert('Full Name is Required', 'Make sure you entered your full name and try again.', [
        { text: 'Ok' },
      ]);
    }
    
    if (!email || email == null || email.match(validEmailReg) == null) {
      errors.email = 'Email is required';
      Alert.alert(
        'Invalid Email Address',
        'Make sure you entered your email correctly and try again.',
        [{ text: 'Ok' }]
      );
    }
    
    if (phoneNumber && phoneNumber.match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)) {
      errors.phone = 'Invalid Phone Number';
      Alert.alert(
        'Invalid Phone Number',
        'Make sure you entered the number in a proper format (2705908539) and try again.',
        [{ text: 'Ok' }]
      );
    }

    return errors;
  };

  const updateCloudProfile = async () => {
    if (user != null) {
      const errors = await validate();
      if (Object.values(errors).length == 0) {
        setIsLoading(true);
        try {
          await updateProfile({ displayName, email });
          setIsLoading(false);
        } catch (error) {
          Alert.alert(
            'An error occurred updating your account',
            'Please try again and if this error continues report it to R.Mend',
            [{ text: 'Ok' }]
          );
          console.log(error);
          setIsLoading(false);
        }
      }
    } else {
      Alert.alert(
        'You need to be signed in to update information',
        'If your think your are signed in, please sign out or reset the app to fix this issue',
        [{ text: 'Okay' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.inputs}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={(text) => setDisplayName(text)}
            keyboardAppearance="dark"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardAppearance="dark"
            keyboardType="email-address"
          />
        </View>
        {/* <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={(text) => this.setState({ phoneNumber: text })}
            placeholder="Optional"
            placeholderTextColor="#555"
            keyboardAppearance="dark"
            keyboardType="phone-pad"
          />
        </View> */}
        {/* <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Address</Text>
          <TextInput style={styles.input} />
        </View> */}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => updateProfileAlert()}>
          <Text style={{ fontSize: wp('6%'), color: 'white', fontWeight: 'bold' }}>
            Save Changes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleSignInOutPress()}>
          <Text style={{ fontSize: wp('6%'), color: 'white', fontWeight: 'bold' }}>
            {user != null ? 'Sign Out' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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
  inputs: {
    marginTop: hp('5%'),
    alignItems: 'center',
  },
  inputWrapper: {
    width: wp('90%'),
    height: hp('7%'),
    marginBottom: hp('3%'),
    backgroundColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 20,
    padding: wp('2%'),
  },
  input: {
    width: wp('65%'),
    fontSize: wp('4%'),
    color: '#666',
    textAlign: 'right',
  },
  inputLabel: {
    width: wp('20%'),
    fontSize: wp('5%'),
    color: '#666',
  },
  buttons: {
    marginTop: hp('20%'),
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
});
