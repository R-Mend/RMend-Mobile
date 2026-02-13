import React from 'react';
import { Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getIssueGroups } from '../../config/FirebaseApp';
import { connect } from 'react-redux';
import { updateDetails, resetReport } from '../../redux/actions';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import Header from '../../components/Header';
import Colors from '../../constants/Colors';
import LoadingOverlay from '../../components/LoadingOverlay';

class ReportDetailsScreen extends React.Component {
  state = { county: '', issueGroups: [] };
  navigationListener = null;

  componentDidMount() {
    const { navigation } = this.props;
    this.navigationListener = navigation.addListener('focus', async () => {
      if (this.state.county != this.props.county) {
        await this.getIssueTypes();
      }
    });
  }

  componentWillUnmount() {
    this.navigationListener.remove();
  }

  getIssueTypes = async () => {
    const issueGroups = await getIssueGroups(this.props.county);
    if (issueGroups.length == 0) {
      Alert.alert(
        'Failed to load incidents',
        'Their was an issue loading incidents in your location. Please check your connection or if your county is using R.Menda and try agian',
        [
          { text: 'Ok', onPress: this.getIssueTypes },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
    this.setState({ county: this.props.county, issueGroups });
  };

  render() {
    const {
      navigation: { navigate },
      details,
      updateDetails,
      resetReport,
      isLoading,
    } = this.props;
    const { issueGroups } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {isLoading && <LoadingOverlay />}
        <Header
          title="Details"
          {...this.props}
          navTitleOne="Home"
          navTitleTwo="Next"
          navActionOne={() => {
            resetReport();
            navigate('Home');
          }}
          navActionTwo={() => navigate('Send')}
        />
        <Text style={styles.header}>Incident Type</Text>
        <Text style={styles.subHeader}>Required</Text>
        {!details.type && (
          <TouchableOpacity
            style={styles.mainSelector}
            disabled={issueGroups.length > 0 ? false : true}
            onPress={() => navigate('ReportTypeGroups', { issueGroups })}
          >
            <Text style={styles.selectorText}>
              {issueGroups.length > 0 ? 'Select the incident type' : 'Loading issue groups...'}
            </Text>
            {issueGroups.length == 0 && <ActivityIndicator size="small" color="white" />}
            {issueGroups.length > 0 && (
              <MaterialIcons name="navigate-next" size={25} color="#FFF" />
            )}
          </TouchableOpacity>
        )}
        {details.type && (
          <TouchableOpacity
            style={styles.selector}
            onPress={() => navigate('ReportTypeGroups', { issueGroups })}
          >
            <Entypo
              name={details.iconName}
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
          value={details.details}
          style={styles.details}
          onChangeText={(text) =>
            updateDetails({
              type: details.type,
              details: text,
              iconName: details.iconName,
            })
          }
          placeholder="Enter a description of the incident"
          placeholderTextColor="#666"
          keyboardAppearance="dark"
          multiline
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ report }) => {
  return {
    county: report.county,
    details: report.details,
    isLoading: report.isLoading,
  };
};
export default connect(mapStateToProps, { updateDetails, resetReport })(ReportDetailsScreen);

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
