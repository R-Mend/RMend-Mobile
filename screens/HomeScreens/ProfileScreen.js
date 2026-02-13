import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { firebaseApp, signOut, updateProfile, getAuthority } from '../../config/FirebaseApp';
import { connect } from 'react-redux';
import { getUserInfo, userSignedOut } from '../../redux/actions';
import LoadingOverlay from '../../components/LoadingOverlay';

class ProfileScreen extends React.Component {
  state = { displayName: null, email: null, phoneNumber: null, authCode: '', isLoading: false };
  navigationListener = null;

  UNSAFE_componentWillMount() {
    const { navigation } = this.props;
    this.navigationListener = navigation.addListener('focus', async () => {
      if (firebaseApp.auth().currentUser !== null) {
        if (this.state.displayName === null) {
          this.setState({ isLoading: true });
          await this.props.getUserInfo();
          this.setState({ ...this.props.user, isLoading: false });
        }
      }
    });
  }

  componentWillUnmount() {
    this.navigationListener.remove();
  }

  signUserOut = async () => {
    await signOut();
    await this.props.userSignedOut();
    this.setState({
      displayName: null,
      email: null,
      phoneNumber: null,
      authCode: '',
      isLoading: false,
    });
    // Auth when authentication is prompted from profile screen
    // this.props.navigation.navigate('Auth')
    this.props.navigation.navigate('SignIn');
  };

  handleSignInOutPress = () => {
    const { navigate } = this.props.navigation;
    if (firebaseApp.auth().currentUser != null) {
      this.signUserOut();
    }
    navigate('SignIn');
  };

  updateProfileAlert = () => {
    Alert.alert('Are you sure you want to make these changes?', 'Changes can be made latter.', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => this.setState(this.props.user),
      },
      { text: 'Ok', onPress: () => this.updateProfile() },
    ]);
  };

  validate = async () => {
    const { displayName, email, authCode, phoneNumber } = this.state;
    const validEmailReg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    const shouldUpdateAuthCode = this.props.user.authCode == this.state.authCode ? false : true;
    let errors = {};
    if (!displayName) {
      errors.displayName = 'Name is required';
      Alert.alert('Full Name is Required', 'Make sure you entered your full name and try agian.', [
        { text: 'Ok' },
      ]);
    } else if (!email || email.match(validEmailReg) == null) {
      errors.email = 'Email is required';
      Alert.alert(
        'Invaled Email Address',
        'Make sure you entered your email correctly and try agian.',
        [{ text: 'Ok' }]
      );
    } else if (
      phoneNumber &&
      !phoneNumber.match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    ) {
      errors.phone = 'Invaled Phone Number';
      Alert.alert(
        'Invaled Phone Number',
        'Make sure you entered the number in a proper format (2705908539) and try agian.',
        [{ text: 'Ok' }]
      );
    } else if (shouldUpdateAuthCode) {
      const results = await getAuthority(this.state.authCode);
      if (
        (results.error || authCode.match([/\S\s/, /\s\S/])) &&
        authCode.replace(/\s/g, '').length > 0
      ) {
        errors.authCode = 'Invaled Authority Code';
        Alert.alert(
          'Invaled Authority Code',
          'Make sure you entered the code correctly and try agian.',
          [{ text: 'Ok' }]
        );
      }
    }
    return errors;
  };

  updateProfile = async () => {
    if (firebaseApp.auth().currentUser != null) {
      const errors = await this.validate();
      const shouldUpdateAuthCode = this.props.user.authCode == this.state.authCode ? false : true;
      if (Object.values(errors).length == 0) {
        this.setState({ isLoading: true });
        if (shouldUpdateAuthCode) {
          await Alert.alert(
            'Sign Out Required',
            'Updating your authority code requires you to sign out.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  this.setState({ isLoading: false });
                  this.setState(this.props.user);
                },
              },
              {
                text: 'Ok',
                onPress: async () => {
                  var result = await updateProfile(this.state, true);
                  if (result.error) {
                    Alert.alert(
                      'An error occurred updating your account',
                      'Please try agian and if this error continues report it to R.Mend',
                      [{ text: 'Ok' }]
                    );
                    console.log(error);
                    this.setState({ isLoading: false });
                  } else {
                    this.signUserOut();
                  }
                },
              },
            ]
          );
        } else {
          const results = await updateProfile(this.state, false);
          if (results.error) {
            Alert.alert(
              'An error occurred updating your account',
              'Please try agian and if this error continues report it to R.Mend',
              [{ text: 'Ok' }]
            );
            console.log(error);
            this.setState({ isLoading: false });
          } else {
            await this.props.getUserInfo();
            this.setState({ ...this.props.user, isLoading: false });
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

  render() {
    const { displayName, email, phoneNumber, authCode, isLoading } = this.state;
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
              onChangeText={(text) => this.setState({ displayName: text })}
              keyboardAppearance="dark"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => this.setState({ email: text })}
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
              value={authCode}
              onChangeText={(text) => this.setState({ authCode: text })}
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
          <TouchableOpacity style={styles.button} onPress={() => this.updateProfileAlert()}>
            <Text style={{ fontSize: wp('6%'), color: 'white', fontWeight: 'bold' }}>
              Save Changes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.handleSignInOutPress()}>
            <Text style={{ fontSize: wp('6%'), color: 'white', fontWeight: 'bold' }}>
              {firebaseApp.auth().currentUser != null ? 'Sign Out' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
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
