import React, { useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { detailsUpdated, reportReset, issueGroupsUpdated } from '@/redux/features/reportSlice';
import Header from '@/components/Header';
import Colors from '@/styles/constants/Colors';
import LoadingOverlay from '@/components/LoadingOverlay';
import { FirebaseCountyClient } from '@/services/county/FirebaseCountyClient';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';


export default function ReportDetailsScreen() {
  const [previousCounty, setPreviousCounty] = React.useState('');

  const county = useAppSelector((state) => state.report.county);
  const details = useAppSelector((state) => state.report.details);
  const isLoading = useAppSelector((state) => state.report.isLoading);
  const issueGroups = useAppSelector((state) => state.report.issueGroups);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (county && county != previousCounty) {
      getIssueGroups();
    }
  }, [county]);

  const getIssueGroups = async () => {
    const issueGroups = await FirebaseCountyClient.getIssueGroups(county);
    if (issueGroups.length == 0) {
      Alert.alert(
        'Failed to load incidents',
        'Their was an issue loading incidents in your location. Please check your connection or if your county is using RMend and try again',
        [
          { text: 'Ok', onPress: getIssueGroups },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
    dispatch(issueGroupsUpdated(issueGroups));
    setPreviousCounty(county);
  };

  const handleIssueGroupPress = () => {
    router.navigate('/home/report/details/typegroups');
  }

  return (
    <View style={styles.container}>
      {isLoading && <LoadingOverlay />}
      <Header
        title="Details"
        navTitleOne="Home"
        navTitleTwo="Next"
        navActionOne={() => {
          router.dismiss();
          dispatch(reportReset());
        }}
        navActionTwo={() => router.navigate('/home/report/send')}
      />
      <Text style={styles.header}>Incident Type</Text>
      <Text style={styles.subHeader}>Required</Text>
      {!details.type ? (
        <TouchableOpacity
          style={styles.mainSelector}
          disabled={issueGroups.length > 0 ? false : true}
          onPress={() => handleIssueGroupPress()}
        >
          <Text style={styles.selectorText}>
            {issueGroups.length > 0 ? 'Select the incident type' : 'Loading issue groups...'}
          </Text>
          {issueGroups.length == 0 ? <ActivityIndicator size="small" color="white" /> : <MaterialIcons name="navigate-next" size={25} color="#FFF" />}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.selector}
          onPress={() => handleIssueGroupPress()}
        >
          <Entypo
            name={details.iconName as any} // TODO: replace 'any' with converted icon type from backend
            size={wp('6%')}
            color="#ff6a30"
            style={{ marginLeft: wp('2%') }}
          />
          <Text style={styles.selectorText}>{details.type}</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.header}>Details</Text>
      <Text style={styles.subHeader}>Optional</Text>
      <TextInput
        value={details.description}
        style={styles.details}
        onChangeText={(text) =>
          dispatch(detailsUpdated({ type: details.type, description: text, iconName: details.iconName }))
        }
        placeholder="Enter a description of the incident"
        placeholderTextColor="#666"
        keyboardAppearance="dark"
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#000',
    height: hp('100%'),
  },
  header: {
    width: wp('100%'),
    fontSize: wp('5%'),
    color: Colors.mainText,
    fontFamily: 'Arial-BoldMT',
    padding: wp('1%'),
    marginTop: hp('2%'),
  },
  subHeader: {
    width: wp('100%'),
    fontSize: wp('3%'),
    color: '#444',
    marginBottom: hp('1%'),
    paddingLeft: '1%',
    fontFamily: 'Arial',
  },
  mainSelector: {
    width: wp('100%'),
    height: hp('8%'),
    marginBottom: hp('3%'),
    backgroundColor: '#181818',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    padding: wp('1%'),
  },
  selector: {
    width: wp('100%'),
    height: hp('8%'),
    marginBottom: hp('3%'),
    backgroundColor: '#181818',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    padding: wp('1%'),
  },
  selectorText: {
    fontSize: wp('5%'),
    color: '#FFF',
    marginLeft: wp('3%'),
  },
  details: {
    width: wp('100%'),
    height: hp('15%'),
    marginBottom: hp('2%'),
    backgroundColor: '#181818',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    padding: wp('5%'),
    fontSize: wp('4%'),
    color: '#666',
  },
});
