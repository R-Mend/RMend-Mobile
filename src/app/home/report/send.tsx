import React from 'react';
import { Text, StyleSheet, ScrollView, View, Alert, Image } from 'react-native';
import { TouchableHighlight, TextInput } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LoadingOverlay from '@/components/LoadingOverlay';

import { updateSenderInfo, resetReport, startUpload, stopUpload } from '@/redux/actions';
import { firebaseApp, createReport } from '@/config/FirebaseApp';
import validate from '@/redux/validate';
import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';


interface ReportSendScreenProps {
  report: {
    images: any[];
    details: any;
    senderInfo: any;
    location: { latitude: any, longitude: any },
    authority: { authCode: any, name: any, type: any },
    isLoading: boolean;
    info: any;
  };
  updateSenderInfo: (info: any) => void;
  resetReport: () => void;
  startUpload: () => void;
  stopUpload: () => void;
  updateInfo: (info: any) => void;
}

function ReportSendScreen(props: ReportSendScreenProps) {
  const { report, updateSenderInfo, resetReport, startUpload, stopUpload, updateInfo } = props;
  const [name, setName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [phoneNumber, setPhoneNumber] = React.useState(null);

  const router = useRouter();

  React.useEffect(() => {
    const user = firebaseApp.auth().currentUser;
    if (user) {
      updateSenderInfo({
        name: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
      setName(user.displayName);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber);
    }
  }, [updateSenderInfo]);

  const sendReportAsync = async () => {
    const errors = validate(report);
    if (Object.values(errors).length > 0) {
      Alert.alert(
        'A Required Field Is Missing',
        'Check that all the required fields have been provided.',
        [{ text: 'Ok', style: 'cancel' }]
      );
    } else {
      startUpload();
      const results = await createReport(report);
      if (results.error) {
        Alert.alert(
          'An error occurred while creating the report',
          'Please try again and if the issue continues try uploading images with better connection.',
          [{ text: 'Ok' }]
        );
        stopUpload();
      } else {
        await resetReport();
        router.dismiss();
      }
    }
  };

  return (
    <View style={styles.container}>
      {report.isLoading && <LoadingOverlay />}
      <Header
        title="Send"
        {...props}
        navTitleOne="Home"
        navTitleTwo="Send"
        navActionOne={() => {
          resetReport();
          router.dismiss();
        }}
        navActionTwo={() => {
          Alert.alert(
            "Are you sure you're ready to submit this report?",
            'Make sure all fields are filled with as accurately as possible.',
            [
              { text: 'Yes', onPress: sendReportAsync },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Authority</Text>
        <Text style={styles.subHeader}>This report will be sent to:</Text>
        {report.authority.name != '' && (
          <TouchableHighlight style={styles.authInfoWrapper}>
            <View style={styles.authInfo}>
              <Image
                source={require('../../../assets/images/placeholder-dark.jpg')}
                style={styles.authInfoImage}
              />
              <View>
                <Text style={styles.authInfoText}>{report.authority.name}</Text>
                <Text style={styles.authInfoType}>{report.authority.type}</Text>
              </View>
            </View>
          </TouchableHighlight>
        )}
        {report.authority.name == '' && (
          <TouchableHighlight style={styles.authInfoWrapper}>
            <View style={styles.authInfo}>
              <View>
                <Text style={styles.authInfoText}>Issue Type Selection Required</Text>
              </View>
            </View>
          </TouchableHighlight>
        )}
        <Text style={styles.warring}>
          If this is an emergency, please call emergency services.
        </Text>
        <Text style={styles.header}>My Details</Text>
        <Text style={styles.subHeader}>Required</Text>
        <View style={styles.inputs}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => updateInfo({ ...report.info, name: text })}
              placeholder="Required"
              editable={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => updateInfo({ ...report.info, email: text })}
              placeholder="Required"
              editable={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={(text) => updateInfo({ ...report.info, phoneNumber: text })}
              placeholder="Optional"
              editable={false}
            />
          </View>
        </View>
        <View style={{ height: 30 }}></View>
        {/* <Text style={styles.subHeader}>Optional</Text>
        <View style={styles.inputWrapperSmall}>
          <Text style={styles.inputLabelSmall}>Telephone</Text>
          <TextInput
            style={styles.inputSmall}
            onChangeText={text => updateInfo({ ...report.info, phoneNumber: text })}
            placeholder="Optional"
            editable={false}
          />
        </View> */}
      </ScrollView>
    </View>
  );
}

const mapStateToProps = ({ report }) => {
  return {
    report: report,
  };
};
export default connect(mapStateToProps, { updateSenderInfo, resetReport, startUpload, stopUpload })(
  ReportSendScreen
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    height: hp('100%'),
  },
  content: {
    height: hp('100%'),
    alignItems: 'center',
  },
  header: {
    width: wp('100%'),
    fontSize: wp('5%'),
    color: Colors.mainText,
    fontFamily: 'Arial-BoldMT',
    marginLeft: wp('5%'),
    marginTop: hp('2%'),
  },
  subHeader: {
    width: wp('100%'),
    fontSize: wp('3%'),
    color: '#444',
    marginBottom: hp('1%'),
    marginLeft: wp('5%'),
    fontFamily: 'Arial',
  },
  authInfoWrapper: {
    width: wp('100%'),
    height: hp('10%'),
    marginBottom: hp('3%'),
    backgroundColor: '#181818',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    padding: wp('1%'),
  },
  authInfo: {
    width: wp('90%'),
    height: hp('8%'),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  authInfoImage: {
    width: hp('8%'),
    height: hp('8%'),
    marginRight: wp('1%'),
    borderRadius: 20,
  },
  authInfoText: {
    fontSize: wp('4%'),
    color: 'white',
  },
  authInfoType: {
    color: '#666',
  },
  warring: {
    width: wp('50%'),
    fontSize: wp('3%'),
    color: '#444',
    alignSelf: 'flex-start',
    marginLeft: wp('5%'),
  },
  inputs: {
    width: wp('100%'),
    backgroundColor: '#181818',
  },
  inputWrapper: {
    width: wp('100%'),
    height: hp('8%'),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#555',
    borderBottomWidth: 1,
    borderBottomStartRadius: wp('10%'),
    borderBottomRightRadius: wp('10%'),
    padding: wp('1%'),
  },
  input: {
    width: wp('70%'),
    fontSize: wp('4%'),
    color: '#666',
    textAlign: 'right',
  },
  inputLabel: {
    width: wp('20%'),
    fontSize: wp('4%'),
    color: '#666',
  },
  inputSmall: {
    width: wp('70%'),
    fontSize: wp('3%'),
    color: '#666',
    textAlign: 'right',
  },
  inputLabelSmall: {
    width: wp('20%'),
    fontSize: wp('3%'),
    color: '#666',
  },
  inputWrapperSmall: {
    width: wp('100%'),
    height: hp('7%'),
    backgroundColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    padding: wp('1%'),
  },
});
