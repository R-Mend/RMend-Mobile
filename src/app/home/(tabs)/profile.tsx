import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRouter } from 'expo-router';

import { firebaseApp, signOut, updateProfile, getAuthority } from '@/config/FirebaseApp';
import { connect } from 'react-redux';
import { getUserInfo, userSignedOut } from '@/redux/actions';
import LoadingOverlay from '@/components/LoadingOverlay';


interface ProfileScreenProps {
  getUserInfo: () => Promise<void>;
  userSignedOut: () => Promise<void>;
  user: {
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    authCode: string;
  };
}

function ProfileScreen(props: ProfileScreenProps) {
  const [user, setUser] = React.useState({
    displayName: null,
    email: null,
    phoneNumber: null,
    authCode: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [navigationListener, setNavigationListener] = React.useState(null);

  const navigation = useNavigation();
  const router = useRouter();

  React.useEffect(() => {
    const listener = navigation.addListener('focus', async () => {
      if (firebaseApp.auth().currentUser !== null) {
        if (user.displayName === null) {
          setIsLoading(true);
          await props.getUserInfo();
          setUser(props.user);
          setIsLoading(false);
        }
      }
    });
    setNavigationListener(listener);
  });

  React.useEffect(() => {
    return () => {
      if (navigationListener) {
        navigationListener();
      }
    };
  }, [navigationListener]);

  const signUserOut = async () => {
    await signOut();
    await props.userSignedOut();
    setUser({
      displayName: null,
      email: null,
      phoneNumber: null,
      authCode: '',
    });
    setIsLoading(false);
    router.replace('/auth/signin');
  };

  const handleSignInOutPress = () => {
    if (firebaseApp.auth().currentUser != null) {
      signUserOut();
    }
    router.replace('/auth/signin');
  };

  const updateProfileAlert = () => {
    Alert.alert('Are you sure you want to make these changes?', 'Changes can be made latter.', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => setUser(props.user),
      },
      { text: 'Ok', onPress: () => updateCloudProfile() },
    ]);
  };

  const validate = async () => { // TODO: Update this to use Formik validation schema like other screens
    interface IValidationErrors {
      displayName?: string
      email?: string;
      phone?: string
      authCode?: string;
    }
    const validEmailReg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    const shouldUpdateAuthCode = props.user.authCode == user.authCode ? false : true;
    let errors: IValidationErrors = {};
    if (!user.displayName) {
      errors.displayName = 'Name is required';
      Alert.alert('Full Name is Required', 'Make sure you entered your full name and try again.', [
        { text: 'Ok' },
      ]);
    } else if (!user.email || user.email.match(validEmailReg) == null) {
      errors.email = 'Email is required';
      Alert.alert(
        'Invalid Email Address',
        'Make sure you entered your email correctly and try again.',
        [{ text: 'Ok' }]
      );
    } else if (
      user.phoneNumber &&
      !user.phoneNumber.match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    ) {
      errors.phone = 'Invalid Phone Number';
      Alert.alert(
        'Invalid Phone Number',
        'Make sure you entered the number in a proper format (2705908539) and try again.',
        [{ text: 'Ok' }]
      );
    } else if (shouldUpdateAuthCode) {
      const results = await getAuthority(user.authCode);
      if (
        (results.error || user.authCode.match(/\S\s/) || user.authCode.match(/\s\S/)) &&
        user.authCode.replace(/\s/g, '').length > 0
      ) {
        errors.authCode = 'Invalid Authority Code';
        Alert.alert(
          'Invalid Authority Code',
          'Make sure you entered the code correctly and try again.',
          [{ text: 'Ok' }]
        );
      }
    }
    return errors;
  };

  const updateCloudProfile = async () => {
    if (firebaseApp.auth().currentUser != null) {
      const errors = await validate();
      const shouldUpdateAuthCode = props.user.authCode == user.authCode ? false : true;
      if (Object.values(errors).length == 0) {
        setIsLoading(true);
        if (shouldUpdateAuthCode) {
          await Alert.alert(
            'Sign Out Required',
            'Updating your authority code requires you to sign out.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  setIsLoading(false);
                  setUser(props.user);
                  
                },
              },
              {
                text: 'Ok',
                onPress: async () => {
                  var result = await updateProfile(user, true);
                  if (result.error) {
                    Alert.alert(
                      'An error occurred updating your account',
                      'Please try again and if this error continues report it to R.Mend',
                      [{ text: 'Ok' }]
                    );
                    console.log(result.error);
                    setIsLoading(false);
                  } else {
                    signUserOut();
                  }
                },
              },
            ]
          );
        } else {
          const results = await updateProfile(user, false);
          if (results.error) {
            Alert.alert(
              'An error occurred updating your account',
              'Please try again and if this error continues report it to R.Mend',
              [{ text: 'Ok' }]
            );
            console.log(results.error);
            setIsLoading(false);
          } else {
            await props.getUserInfo();
            setIsLoading(false);
            setUser(props.user);
          }
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
            value={user.displayName}
            onChangeText={(text) => setUser({ ...user, displayName: text })}
            keyboardAppearance="dark"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
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
        <View style={styles.inputWrapper}>
          <Text style={{ ...styles.inputLabel, width: wp('35%') }}>Authority Code</Text>
          <TextInput
            style={{ ...styles.input, width: wp('45%') }}
            value={user.authCode}
            onChangeText={(text) => setUser({ ...user, authCode: text })}
            placeholder="Optional"
            placeholderTextColor="#555"
            keyboardAppearance="dark"
            secureTextEntry
          />
        </View>
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
            {firebaseApp.auth().currentUser != null ? 'Sign Out' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const mapStateToProps = ({ user }) => {
  return { user };
};

export default connect(mapStateToProps, { getUserInfo, userSignedOut })(ProfileScreen);

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
