import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';

import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from '@/components/LoadingOverlay';
import CommonStyles from '@/styles/CommonStyles';

export default function SignInScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signInWithEmailPassword } = useAuth();

  const handleSignInSubmit = async (values: { email: string; password: string }) => {
    if (values.email.length === 0 || values.password.length === 0) return;
    setIsLoading(true);
    try {
      await signInWithEmailPassword({ email: values.email, password: values.password });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.alert(
        'Email or password is incorrect',
        err instanceof Error ? err.message : 'Make sure you entered your email or password correctly and try again.',
        [{ text: 'Ok', style: 'cancel' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      <Text style={styles.header}>R.Mend</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => {
          handleSignInSubmit(values);
        }}
        validationSchema={validationSchema}
      >
        {({ handleBlur, handleChange, handleSubmit, values, isValid, errors, touched }) => (
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={values.email}
                onBlur={handleBlur('email')}
                onChangeText={handleChange('email')}
                placeholder={touched.email && errors.email ? 'Email is required' : 'Enter Email'}
                placeholderTextColor={touched.email && errors.email ? Colors.mainText : '#555'}
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                value={values.password}
                onBlur={handleBlur('password')}
                onChangeText={handleChange('password')}
                placeholder={
                  touched.password && errors.password ? 'Password is required' : 'Enter Password'
                }
                placeholderTextColor={
                  touched.password && errors.password ? Colors.mainText : '#555'
                }
                style={styles.input}
                secureTextEntry
              />
            </View>
            <View style={CommonStyles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                <Text style={{ fontSize: wp('6%'), color: 'white', fontWeight: 'bold' }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
      <TouchableOpacity
        onPress={() => router.navigate('/auth/createuser')}
        style={styles.link}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(4, 'Password must have at least 4 characters '),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: Colors.mainText,
    textAlign: 'center',
    fontSize: wp('25%'),
    fontFamily: 'passion-one-regular',
    paddingBottom: hp('5%'),
    justifyContent: 'center',
  },
  form: {
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
    width: wp('62%'),
    fontSize: wp('4%'),
    color: '#666',
    textAlign: 'right',
  },
  inputLabel: {
    width: wp('23%'),
    fontSize: wp('5%'),
    color: '#666',
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
  link: {
    width: wp('100%'),
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  linkText: {
    fontSize: wp('5%'),
    color: Colors.mainText,
  },
});
